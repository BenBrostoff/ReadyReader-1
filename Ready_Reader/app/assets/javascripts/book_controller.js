var BookController = function(book) {

  // var bookview = new BookView();
  this.bookview;

  var turnPageRight = function() {
    book.turnPageRight();
    book.checkForBeginning();

    bookview.showSentence(book.changeSentence(book.current));

    UpdatePage.page(book, bookview);
  }

  var turnPageLeft = function() {
    book.turnPageLeft();
    book.checkForEnd();

    bookview.showSentence(book.changeSentence(book.current));

    UpdatePage.page(book, bookview);
  }

  this.initialize = function (bookview) {
    this.bookview = bookview;
    bookview.book = this.book;

    // bookview.hideNonCurrent();
    // text = bookview.getCurrentText(book.current);
    // bookview.showCurrentSentence(book.advanceSentence());


    Slider.sliderProgress(book, book.current, book.end);

    // consider refactoring (event binding link on 42-44)
    $('#slider_bar').draggable();

    $('#slider_bar').mouseup(function() {
      var newPoint = +$(this).slider('value');
      book.current = newPoint;

      bookview.showSentence(book.changeSentence(book.current));
      Slider.updateText(book, bookview);
    });

    var bookmark = function(){
      setBookmark(book.current, book.end);
    }

    bookview.getPage().on("click", ".right", turnPageRight)
    Mousetrap.bind('left', turnPageRight)

    bookview.getPage().on("click", ".left", turnPageLeft)
    Mousetrap.bind('right', turnPageLeft)

    bookview.getPage().on("click", ".nav_quad_3", bookmark);

  }
};
