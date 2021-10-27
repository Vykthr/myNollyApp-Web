import { AuthGuard } from './../auth/auth.guard';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const firebaseConfig = {
  apiKey: "AIzaSyAxnvBRSsx5bW1IVf5YTWgR0cb7bUkg7vw",
  authDomain: "mynollyapp-39d23.firebaseapp.com",
  databaseURL: "https://mynollyapp-39d23.firebaseio.com",
  projectId: "mynollyapp-39d23",
  storageBucket: "mynollyapp-39d23.appspot.com",
  messagingSenderId: "204569611961",
  appId: "1:204569611961:web:cadebe4ab0778cb84d1568",
  measurementId: "G-G3KBSG41XM"
};

const TOKEN_KEY = 'myNollyApp_User'

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  currentViewing : BehaviorSubject<''>;
  movieList :BehaviorSubject<[]>;
  comedyList: any = []
  dramaList: any = []
  ratedList: any = []
  recommendedList: any = []
  popularList: any = []
  romanceList: any = [];
  db: any;
  userDetails: BehaviorSubject<any>;
  currentUser: any;
  replacers = ['/', '*', '&', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  shift = 5;

  
  years = new Array(20);
  genres = ['crime', 'comedy', 'action', 'love', 'romance', 'drama', 'fiction', ];
  languages = ['english', 'hausa', 'igbo', 'yoruba', 'others'];
  froms = ['youtube', 'ibaka', 'iroko', 'netflix', 'amazon', 'cinemas', 'default']
  types = ['Movie', 'Series', 'Short Film']


  constructor(private router: Router, private auth: AuthGuard) {
    this.movieList = new BehaviorSubject<[]>([]);
    this.currentViewing = new BehaviorSubject<''>('');
    this.userDetails = new BehaviorSubject<{}>({})
    firebase.initializeApp(firebaseConfig);
    this.db = firebase.firestore();
    this.init()
    
    // this.autoLogin();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
      } else {

      }
    })
  }

  setValue(newValue: any): void {
    this.movieList.next(newValue)
  }

  getValue(): Observable<[]> {
    return this.movieList.asObservable();
  }

  setUserValue(newValue: any): void {
    this.userDetails.next(newValue)
  }

  getUserValue(): Observable<{}> {
    return this.userDetails.asObservable();
  }

  setViewing(newValue: any): void {
    this.currentViewing.next(newValue)
  }

  getViewing(): Observable<{}> {
    return this.currentViewing.asObservable();
  }

  async init() {
    await this.fetchMovies().then(async (res) => {
      setTimeout(async () => {
        this.setValue(res)
        setTimeout(() => {
          this.categorizeMovies()
        }, 1000)
      }, 500)
    })
    this.autoLogin();
  }

  async fetchMovies(): Promise<any> {
    return await new Promise(async (resolve, reject) => {
      await this.db.collection("movies").orderBy("added", 'desc').get().then(async (querySnapshot: any) => {
        let movies: any = await querySnapshot.docs
          .map((snap: any) => {
          return {
            id: snap.id,
            details: snap.data()
          };
        })
        console.log(movies)
        resolve(movies)
      }).catch((err: any) => {
        console.log(err)
      })
    })
  }

  getRate(votes: any, views: any) {
    let rating = (votes/views) * 5;
    if (rating >= 5 ) {
      return 5;
    } else {
      return rating.toFixed(1)
    }
  }

  categorizeMovies() {
      this.ratedList= this.movieList.value.filter((movie: any) => this.getRate(movie.details.votes, movie.details.views) > 2)

      this.recommendedList= this.movieList.value.filter((movie: any, index: any) => index%2 ==1 )
      
      this.dramaList = this.movieList.value.filter((movie: any) => movie.details.genre.includes("drama"))

      this.comedyList = this.movieList.value.filter((movie: any) => movie.details.genre.includes("comedy"))

      this.romanceList = this.movieList.value.filter((movie: any) => movie.details.genre.includes("romance"))
      this.popular(this.movieList.value);
  }

  async popular(arr: any) {
    const pop = arr.slice().sort((a: any, b: any) => {
      let nameA = a.details.views;
      let nameB = b.details.views;
      if (nameA < nameB) {
        return 1;
      }
      if (nameA > nameB) {
        return -1;
      }
      // names must be equal
      return 0;
    });
    this.popularList = pop.map((movie: any) => movie)    
  }

  viewMovie(movie: any) {
    this.setViewing(movie);
    this.router.navigate(['/movie/'+ movie.details.title.replaceAll(' ', '-')]);
  }

  onActivate() {
    let scrollToTop = window.setInterval(() => {
        let pos = window.pageYOffset;
        if (pos > 0) {
            window.scrollTo(0, pos - 20); // how far to scroll on each step
        } else {
            window.clearInterval(scrollToTop);
        }
    }, 16);
  }

  signup(email: string, password: string, fname: string, surname: string, phone: string, dob: any, country: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((newUserCredential: firebase.auth.UserCredential) => {
        firebase.firestore().doc(`/users/${newUserCredential?.user?.uid}`).set(
          {firstName: fname, surname, phone, email, dob, views: [], votes: [], country}).then(() => {
            firebase.auth()?.currentUser?.sendEmailVerification();
          })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
    });
  }

  login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  getUserProfile(): Promise<any> {
    return new Promise((resolve) => {
      firebase.firestore().doc(`/users/${this.currentUser.uid}`).onSnapshot(userProfileSnapshot => {
        this.setUserValue(userProfileSnapshot.data())
        resolve(this.userDetails);
      })
    });
  }

  encrypt = async(string: string) => {
    let encryption = "";
    await [ ...string ].forEach((char) => {
      if(this.replacers.includes(char)) {
          const charIndex = this.replacers.indexOf(char)
          const replacerIndex = charIndex + this.shift
          encryption += (replacerIndex > this.replacers.length - 1) ? this.replacers[replacerIndex - this.replacers.length] : this.replacers[replacerIndex]
      } else {
          encryption += char
      }
    })
    return encryption
  }

  decrypt = async(string: string) => {
    let encryption = "";
    await [ ...string ].forEach((char) => {
      if(this.replacers.includes(char)) {
          const charIndex = this.replacers.indexOf(char)
          const replacerIndex = charIndex - this.shift
          encryption += (replacerIndex < 0) ? this.replacers[this.replacers.length - replacerIndex] : this.replacers[replacerIndex]
      } else {
          encryption += char
      }
    })
    return encryption
  }

  async autoLogin() {
    Storage.get({key: TOKEN_KEY}).then(async (res: any) => {
      if(res.value) {
        res = JSON.parse(res.value)
        const pass = await this.decrypt(res.password)
        await this.login(res.email, pass).then(() => {
          setTimeout(() => {
            this.getUserProfile().then((data) => {
              this.auth.setValue(true);
              if (data.isAdmin) {
                window.location.href = 'https://admin.myNollyApp.com';
              }
            })
          }, 500);
        });
      }
    })
  }


  signOut() {
    firebase.auth().signOut();
    this.setUserValue({})
    this.auth.setValue(false)
    this.router.navigateByUrl('')
  }
}
