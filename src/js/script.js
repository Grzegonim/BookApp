{
  'use strict';
  const templates = {
    books: Handlebars.compile(document.querySelector('#template-book').innerHTML),
  };

  const DomElements = {
    bookContainer: document.querySelector('.books-list'),
    formFilter: document.querySelector('.filters'),
  };

  let favoriteBooks = [];
  const filters = [];


  class BooksList {
    constructor() {
      const thisBook = this;
      thisBook.initData();
      thisBook.render();
      thisBook.initActions();
      thisBook.filterBooks();       
    }

    initData() {
      this.data = dataSource.books;
    }

    render(){
      const thisBook = this;
      for(let book of dataSource.books){
        const ratingBgc = thisBook.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        book.ratingWidth = ratingWidth;
        book.ratingBgc = ratingBgc;
        const generatedHTML = templates.books(book);
        let generatedDOM = utils.createDOMFromHTML(generatedHTML);
        DomElements.bookContainer.appendChild(generatedDOM);
      }
    }

    initActions(){  
      DomElements.bookContainer.addEventListener('dblclick', function(event){
        event.preventDefault();
        if(event.target.offsetParent.classList.contains('book__image')){
          if(!event.target.offsetParent.classList.contains('favorite')){event.target.offsetParent.classList.add('favorite');
            const bookId = event.target.offsetParent.getAttribute('data-id');
            favoriteBooks.push(bookId);
          }else{
            const bookId = event.target.offsetParent.getAttribute('data-id');
            const bookIndex = favoriteBooks.indexOf(bookId);
            favoriteBooks.splice(bookIndex, 1);
            event.target.offsetParent.classList.remove('favorite');
          }
        }
      });
      DomElements.formFilter.addEventListener('click', function(event){
        if(event.target.name == 'filter' && event.target.tagName == 'INPUT' && event.target.type == 'checkbox'){
          if(event.target.checked === true){
            filters.push(event.target.value);
          }else{
            const indexOfValue = filters.indexOf(event.target.value);
            filters.splice(indexOfValue, 1);
          }
        }  
      });
    }

    filterBooks(){
      DomElements.formFilter.addEventListener('click', function(){
        for(let book of dataSource.books){
          const bookImage = document.querySelector('.book__image' + '[data-id="' + book.id + '"]');
          let shouldBeHidden = false;
          for(let filter of filters) {
            if(!book.details[filter]) {
              shouldBeHidden = true;
              break;
            }
          }
          if(shouldBeHidden == true){
            bookImage.classList.add('hidden');
          } else if(shouldBeHidden == false){
            bookImage.classList.remove('hidden');
          }
        }
      });
    }

    determineRatingBgc(rating){
      let ratingBgc = '';
      if(rating < 6){
        ratingBgc = 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)';
      } else if(rating > 6 && rating <= 8){
        ratingBgc = 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)';
      } else if(rating > 8 && rating <= 9){
        ratingBgc = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
      } else if(rating > 9){
        ratingBgc = 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)';
      }
      return ratingBgc;
    }
  }

  const app = new BooksList();
}
