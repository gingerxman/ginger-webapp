
class LoadMoreService {
	constructor() {
		this.curPageInfo = null;
	}

	isFinishLoad() {
		return this.curPageInfo != null && !this.curPageInfo.hasNext;
	}

	updatePageInfo(pageInfo) {
		this.curPageInfo = pageInfo;
	}
}

let service = new LoadMoreService();

export default service;