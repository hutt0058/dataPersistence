angular
.module('emApp', ['ngRoute', 'firebase'])
.constant('firebaseConfig',{
  apiKey: "AIzaSyAbWu9VuW9QAXP46bPhFds7L1etVkC7B2w",
    authDomain: "datapersistance-a8b80.firebaseapp.com",
    databaseURL: "https://datapersistance-a8b80.firebaseio.com",
    storageBucket: "datapersistance-a8b80.appspot.com",
    messagingSenderId: "470736209598"
})
.run(firebaseConfig => firebase.initializeApp(firebaseConfig))
  .service('dbRefRoot', DbRefRoot)
   .service('books', Books)
   .controller('fillerCtrl', FillerCtrl)
   .controller('detailsCtrl', DetailsCtrl)
   .controller('bookCtrl', BookCtrl)
   .config(function ($routeProvider, $locationProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'pages/filler.html',
          controller:  'fillerCtrl'
      })
      
      .when('/detail/:itemId', {
          templateUrl: 'pages/detail.html',
          controller: 'detailsCtrl'
        })
 
       .otherwise({
         redirectTo: '/'
       })
    })
  
 function DbRefRoot() {
   return firebase.database().ref()
 }

function Books(dbRefRoot, $firebaseObject, $firebaseArray){
  const dbRefBooks = 
  dbRefRoot.child('books')
  
  this.get = function get(id){
    return $firebaseObject(dbRefBooks.child(id))
  }
  
  this.getAll = function getAll(){
    return $firebaseArray (dbRefBooks)
  }
}

function FillerCtrl($scope){
  $scope.itemId = null
}

function DetailsCtrl($scope, $routeParams, $location,$window, books){
  
  $scope.book = books.get($routeParams.itemId)
  
  $scope.remove = function remove(books){
  if (confirm("Deleting a book from the database cannot be undone. Are you shure you want to delete this Book?")) {
    console.log('remove button clicked')
    $scope.book.$remove(books);
    $window.location.href = '/';
//    $scope.book =   //figure out how to look up first book in list
  }
}
 
  $scope.save = function save(books) {
  console.log('save being clicked')
  books.edit = false;
  $scope.book.$save(books)
  
  
  
  
//  update: function (itemId, book) {
//     return ref.child('book').child(itemId).set(book);
// }
}
}

function BookCtrl(books){
  this.clearForm = function clearForm(){
    return {
      name: '',
      synopsis: '',
      characters: '',
      antagonists: '',
      releaseDate: '',
      image: '',
      imageAlt: '',
    }
  }


this.newBook = this.clearForm()

this.book = books.get('id')

this.books = books.getAll()



this.close = function close(){
  if (confirm("Clearing this information will mean you will have to restart. Are you shure you want to clear everything?")) {
  this.newBook = this.clearForm()
  }
}




this.addBook = function addBook(newBook){
  this.newBook.id = cuid()
  this.books
  .$add(newBook)
  .then(newRef => {
    $('#addBookModal').modal('hide')
    this.newBook = this.clearForm()
  })
 }
}
