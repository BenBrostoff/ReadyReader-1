class UploadWorker
  @queue = :upload

  def self.perform(info)
    uploaded_io = params[:book]
    @filename = Rails.root.join('public', 'uploads', uploaded_io.original_filename) #look into this tomorrow.
    File.open(@filename, 'wb') do |file|
      file.write(uploaded_io.read)
    end
    @user = User.find(info[:user_id])
    book = EPUB::Parser.parse(info[:file])
    content = ""

    book.each_page_on_spine do |page|
      page = page.content_document.nokogiri
      page.search('p').each{|el| el.before ' '}
      content << page.text
    end

    @book = Book.create(title: "fun", content: content)
    # UserBook.create(user_id: @user.id, book_id: @book.id)
    # @user.books << @book
    # content_array = tokenize_special(@book.content)
    # content_array.each do |sentence|
    #   Sentence.create(book_id: @book.id, content: sentence)
    # end
  end
end
