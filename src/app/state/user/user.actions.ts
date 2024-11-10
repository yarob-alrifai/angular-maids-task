const ACTION_SCOPE = '[User]';

export class LoadUser {
  static readonly type = `${ACTION_SCOPE} Load User`;
  constructor(public userId: number) {}
}

export class loadUsersPage {
  static readonly type = `${ACTION_SCOPE} Load Users Page`;
  constructor(
    public pageNumber: number,
    public perPage: number,
  ) {}
}

export class loadUsersFailure {
  static readonly type = `${ACTION_SCOPE} Load Users Failure`;
  constructor(public error: string) {}
}
