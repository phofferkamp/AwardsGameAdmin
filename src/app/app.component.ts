import { Component, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { DragulaService } from 'ng2-dragula';

import { APIService } from './providers/api-service';

import * as io from "socket.io-client";

declare const CONFIG: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
@ViewChild('loginModal') public loginModal: ModalDirective;
@ViewChild('deleteCategoryConfirmModal') public deleteCategoryConfirmModal: ModalDirective;
@ViewChild('deleteUserConfirmModal') public deleteUserConfirmModal: ModalDirective;
@ViewChild('deleteFeedbackConfirmModal') public deleteFeedbackConfirmModal: ModalDirective;

  socket: any;
  
  loggedIn: any;
  
  invalidLogin = false;

  config = {
    gameMode: "",
    gameStart: "",
    autoStart: ""
  };
  
  gameStart: any;
  autoStart: string;
  
  bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false
  };
  
  timeZones = [
    { zone: "PT", offset: -8 },
    { zone: "MT", offset: -7 },
    { zone: "CT", offset: -6 },
    { zone: "ET", offset: -5 }
  ];
  selectedZone = {offset: 0};

  categories: any;
  
  activeIndex: Number;
  
  category: any;
  
  nominee: string;
  
  categoryToDelete: any;
  
  users: any;
  
  activeUserIndex: Number;
  
  user: any;
  
  picks: any;

  userToDelete: any;
  
  feedbackItems: any;
  
  feedbackToDelete: any;
  
  updatingScores = false;
  loading = 0;
  
  constructor(private dragulaService: DragulaService, private apiService: APIService) {
    dragulaService.drop.subscribe((value) => {
      switch (value[0]) {
        case "categories-bag":
          this.onCategoryDrop();
          break;
      }
    });
  }
  
  ngOnInit() {
    let socketIoPort = location.protocol === 'http:' ? CONFIG.SOCKETIO_PORT_HTTP : CONFIG.SOCKETIO_PORT_HTTPS;
    this.socket = io(CONFIG.API_URL + ':' + socketIoPort);
    
    this.loggedIn = {};
  }
  
  ngAfterViewInit() {
    this.loginModal.show();
  }
  
  login() {
    this.apiService.getUser(this.loggedIn)
      .then(loggedIn => {
          this.invalidLogin = false;
          
          this.loggedIn = loggedIn;
          this.loginModal.hide();
          
          this.reloadConfig();
          this.reloadCategories();
          this.reloadUsers();
          this.reloadFeedback();
      })
    .catch(error => {
      this.invalidLogin = true;
    });
  }
  
  reloadConfig() {
    this.apiService.getConfig()
      .then(config => {
        this.config = config;
        this.resetGameStart();
      });
  }
  
  saveConfig() {
    this.apiService.updateConfig(this.config)
      .then(() => {
        this.reloadConfig();

        this.socket.emit('gg-admin-updated');
      });
  }

  saveGameStart() {
    let timeDifference = this.selectedZone.offset + this.gameStart.getTimezoneOffset() / 60;

    this.config.gameStart = this.gameStart.setHours(this.gameStart.getHours() - timeDifference);
    this.config.autoStart = this.autoStart;

    this.saveConfig();
  }
  
  resetGameStart() {
    this.gameStart = new Date(this.config.gameStart);
    let offset = - this.gameStart.getTimezoneOffset() / 60;
    this.selectedZone = this.timeZones.find(timeZone => {
      return timeZone.offset === offset;
    });

    this.autoStart = this.config.autoStart;
  }
  
  reloadCategories() {
    this.activeIndex = -1;
    this.category = {
      title: '',
      nominees: []
    }
    this.nominee = '';
    
    this.getCategories();
  }

  getCategories() {
    this.apiService.getCategories()
      .then(categories => {
        this.categories = categories;
        this.category.index = categories.length;
        });
  }
  
  addNominee() {
    this.category.nominees.push(this.nominee);
    this.nominee = '';
  }
  
  deleteNominee(i) {
    this.category.nominees.splice(i, 1);
  }
  
  addCategory() {
    this.apiService.addCategory(this.category)
      .then(() => this.reloadCategories());
  }
  
  deleteCategory(event, category) {
    event.stopPropagation();
    
    this.categoryToDelete = category;

    this.deleteCategoryConfirmModal.show();
  }
  
  confirmDeleteCategory(category) {
    this.apiService.deleteCategory(category)
      .then(() => this.reloadCategories());
  }
  
  editCategory(i, category) {
    this.activeIndex = i;
    
    this.category = category;
  }
  
  updateCategory() {
    this.apiService.updateCategory(this.category)
      .then(() => this.reloadCategories());
  }
  
  private onCategoryDrop() {
    for (let i = 0; i < this.categories.length; i++) {
      this.categories[i].index = i;
      this.apiService.updateCategory(this.categories[i]);
    }
  }
    
  reloadUsers() {
    this.activeUserIndex = -1;
    this.user = {
      name: '',
      picks: {},
      score: 0
    }
    this.picks = [];

    this.getUsers();
  }

  getUsers() {
    this.apiService.getUsers()
      .then(users => this.users = users);
  }
  
  addUser() {
    this.user.score = 0;
    // if (!this.user.admin) {
    //   this.user.admin = "false";
    // }

    this.apiService.addUser(this.user)
      .then(() => this.reloadUsers());
  }
  
  editUser(i, user) {
    this.activeUserIndex = i;
    
    this.user = user;

    this.picks = [];
    
    this.apiService.getGame(user)
      .then(game => {
        if (game) {
          for (let category of this.categories) {
            let pick = {
              title: category.title,
              nominee: category.nominees[game.picks[category._id]]
            };
      
            this.picks.push(pick);
          }
        }
      });
  }

  updateName() {
    let user = {
      name: this.user.name
    };
    
    this.apiService.updateUser(this.user._id, this.user)
      .then(() => this.reloadUsers());
  }
  
  updateEmail() {
    let user = {
      email: this.user.email
    };
    
    this.apiService.updateUser(this.user._id, this.user)
      .then(() => this.reloadUsers());
  }
  
  updatePassword() {
    let user = {
      password: this.user.password
    };
    
    this.apiService.updateUser(this.user._id, this.user)
      .then(() => this.reloadUsers());
  }
  
  deleteUser(event, user) {
    event.stopPropagation();
    
    this.userToDelete = user;

    this.deleteUserConfirmModal.show();
  }
  
  confirmDeleteUser(user) {
    this.apiService.deleteUser(user)
      .then(() => this.reloadUsers());
  }
  
  saveWinner(category, nomineeIndex) {
    if (this.config.gameMode === "during") {
      if (category.winner == nomineeIndex) {
        category.winner = -1;
      } else {
        category.winner = nomineeIndex;
      }
      
      this.category = category;
      
      this.apiService.updateCategory(this.category)
        .then(() => {
          this.apiService.getCategories()
            .then(categories => {
              this.categories = categories;
              
                this.apiService.getGames()
                  .then(games => {
                    this.loading = games.length;
                    this.updatingScores = true;
                
                    for (let game of games) {
                      game.score = 0;
        
                      for (let category of this.categories) {
                        if (category.winner > -1 && game.picks[category._id] == category.winner) {
                          game.score++;
                        }
                        
                        this.apiService.updateGame(game)
                          .then(() => this.loading--);
                      }
                    }
                  });
            });
        });
    }
  }
  
  reloadFeedback() {
    this.apiService.getFeedback()
      .then(feedbackItems => this.feedbackItems = feedbackItems);
  }
  
  deleteFeedback(event, feedback) {
    event.stopPropagation();
    
    this.feedbackToDelete = feedback;

    this.deleteFeedbackConfirmModal.show();
  }
  
  confirmDeleteFeedback() {
    this.apiService.deleteFeedback(this.feedbackToDelete)
      .then(() => this.reloadFeedback());
  }

  ngDoCheck() {
    if (this.updatingScores && this.loading < 1) {
      this.updatingScores = false;
      
      this.socket.emit('gg-admin-updated');
    }
  }
}
