import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

enum SearchState {
  Empty = 'Empty',
  TooShort = 'Too short',
  Valid = 'Valid for search',
}

// for presentation purposes
enum BackendCall {
  WasNeeded = 'Was needed',
  ColdStart = 'Was needed (first time)', // happens automatically on page load
  WasNotNeeded = 'Was not needed',
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})

export class SearchComponent implements OnInit {
  ePreviousSearch: SearchState;
  eCurrentSearch: SearchState;
  eDummyState: SearchState;
  eBackendCall: BackendCall;

  constructor() {
    this.ePreviousSearch = SearchState.Empty;
    this.eCurrentSearch = SearchState.Empty;
    this.eDummyState = SearchState.Empty;
    this.eBackendCall = BackendCall.ColdStart;
  }

  ngOnInit() {}

  textField = new FormControl('', [Validators.minLength(3)]);

  modelChanged(input: string) {
    this.ePreviousSearch = this.eDummyState;
    this.eCurrentSearch = this.getSearchState(input);
    this.eBackendCall = this.checkIfBackendCallNeeded(
      this.ePreviousSearch,
      this.eCurrentSearch
    );
    this.eDummyState = this.eCurrentSearch;
  }

  getSearchState(text: string) {
    if (text.length == 0) {
      return SearchState.Empty;
    } else if (text.length < 3) {
      return SearchState.TooShort;
    } else {
      return SearchState.Valid;
    }
  }

  // this needs to be refactored ofc
  checkIfBackendCallNeeded(
    previousSearch: SearchState,
    currentSearch: SearchState
  ) {
    if ((
      previousSearch == SearchState.Empty ||
      previousSearch == SearchState.TooShort) &&
      (currentSearch == SearchState.Empty ||
      currentSearch == SearchState.TooShort))
      {
        return BackendCall.WasNotNeeded;
      }
      else {
        return BackendCall.WasNeeded;
      }
  }
}
