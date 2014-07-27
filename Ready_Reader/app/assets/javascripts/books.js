
var Book = function(current, sentence){
  this.current = current;
  this.end = +$('.pages').text();
  this.sentence = sentence;
}

Book.prototype.checkForEnd = function(){
  if (this.current < this.end) {
        $('.current_sentence').text(this.sentence.currentSentence(this.current));
      } else {$('.current_sentence').text("You've reached the end :-(")}
}

Book.prototype.checkForBeginning = function(){
  if (this.current >= 0) {
          $('.current_sentence').text(this.sentence.currentSentence(this.current));
        } else {$('.current_sentence').text("You're just beginning!")}
}

var Sentence = function(book){
   this.book = book;
   this.pages = +$('.pages').text();
   this.index = 0;

  $(document).ready(function(){ //look into this tomorrow.
    $('.non_current_sentence').hide();

  });
}

Sentence.prototype.increment = function() {
   this.index += 1
   this.book.current = this.index;
   if (this.index > this.pages) {
    this.index = this.pages;
    this.book.current = this.pages;
   }
}

Sentence.prototype.decrement = function() {
  this.index -= 1
  this.book.current = this.index;
  if (this.index < 0) {
    this.index = -1;
    this.book.current = -1;
  }
}

Sentence.prototype.currentSentence = function(index) {
  return $('.sentence' + index).text();
}

Sentence.prototype.barProgress = function(current, end){
   $(function() {
    $( "#progressbar" ).progressbar({
      value: (current / end) * 100,
      check: console.log(this.value)
    });
  });
}

Sentence.prototype.last_point = function(index){
  localStorage['last_point'] = this.index

}

var PageTurn = {

  left: function(sentence, book) {
      sentence.increment();
      book.checkForEnd();
      sentence.barProgress(book.current, book.end);
      $('.progress_bar').hide();
      $('.progress_bar').show();
      sentence.last_point(book.current);
      console.log(localStorage)
  },

  right: function(sentence, book) {
      sentence.decrement();
      book.checkForBeginning();
      sentence.barProgress(book.current, book.end);
      $('.progress_bar').hide();
      $('.progress_bar').show();
      sentence.last_point(book.current);
  }
}

function get_cp(argument){
    return $.ajax({
    url : '/check_point',
    method : 'POST',
    data : { last_point: localStorage['last_point'] },
    success : function(response){

    }
  });
};


$(document).ready(function() {
  $('.sentence_wrapper').hide();
  var positionUpdate = function(){
    return get_cp();
  }

 positionUpdate().done(function(result){ //may need slight tweaks.
    book = new Book(result.farthest_point, new Sentence())
    sentence = new Sentence(book);
    console.log(book);
    $('.current_sentence').text(sentence.currentSentence(book.current));
    $('.sentence_wrapper').show();

  })

  page = document.getElementById('book_wrapper')

  var hammer_time = new Hammer(page);
  hammer_time.on('swipeleft', function(){
    swipeleftHandler();
     get_cp();
  });
  hammer_time.on('swiperight', function(){
    swiperightHandler();
    get_cp();
  });


  function swipeleftHandler(){
    PageTurn.left(sentence, book);

  }

  function swiperightHandler() {
    PageTurn.right(sentence, book);
  }

});


