class UsersController < ApplicationController
  before_filter :check_for_mobile
  before_filter :prepare_for_mobile

  include Tact_Token

  def index
    session[:user] = User.first.id #sets promo user
    @book = Book.first

    @sentences = @book.prep_for_dom
    @pages = @book.pages

    session[:book] = @book.id

    @user = User.find(1)
    @comments = Comment.where(book_id: @book.id, user_id: @user.id)
  end

  def profile
    p "*************************"
    p "TEST TEST"
    @this_user = User.find(params[:id])

    # give each user a sample library

    @books = @this_user.books
    Book.where(universal: true).each do |book|
      p "#{book.title}"
      if @this_user.books.where(id: book.id).size == 0
        p "BOOK BEING ADDED"
        @this_user.books << book
      end
    end
    @comments = @this_user.comments

  end

  def create
    @user = User.new(user_params(params))
    if @user.save
      session[:user] = @user.id
      redirect_to profile_path(@user)
    else
      redirect_to root_path, flash: {notice_signup: 'Invalid signup.'}
    end
  end

  def login
    @user = User.find_by(email: params[:user][:email])
    if @user && @user.authenticate(params[:user][:password])
      session[:user] = @user.id
      redirect_to profile_path(@user)
    else
      redirect_to root_path, flash: {notice_login: 'Invalid credentials.' }
    end
  end

  def sign_out
    session.clear
    redirect_to :root
  end

  def show
    @user = User.find(params[:id])
  end

 private

  def user_params(params)
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end

end
