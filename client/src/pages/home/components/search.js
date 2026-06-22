function Search({ searchKey, setSearchKey }) {
  //Adding the same name of props because this is object destructing, we can use any name here but it is a good practice to use the same name as the props we are passing from the parent component. This makes the code more readable and easier to understand.
  return (
    <div className="user-search-area">
      <input
        type="text"
        className="user-search-text"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)} //e.target.value is the value of the input field, we are updating the searchKey state with the value of the input field whenever it changes. This allows us to keep track of the user's search input and use it to filter the chat list or perform other actions based on the search query.
        placeholder="Search or start new chat"
      />
      <i className="fa fa-search user-search-btn" aria-hidden="true"></i>
    </div>
  );
}

export default Search;
