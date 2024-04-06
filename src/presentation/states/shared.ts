class Shared {
  public nav  = new SharedNav()
  public page = new SharedPage()
}

class SharedNav {
  public enabled: boolean = true
}


class SharedPage {
  public name: string = ''
}

export const useShared = () => useState('shared', () => new Shared())
