export default class XgplayerTimeRange {
    bufferedList: any[]
    constructor (bufferedList: any[]) {
      this.bufferedList = bufferedList
    }
  
    start (index: number) {
      return this.bufferedList[index].start
    }
  
    end (index: number) {
      return this.bufferedList[index].end
    }
  
    get length () {
      return this.bufferedList.length
    }
  }
  