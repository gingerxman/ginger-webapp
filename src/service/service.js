import LoadMoreService from '../service/load_more_service'

class PageInfo {
	constructor(countPerPage) {
		this.hasNext = true;
		this.nextFromId = 0;
		this.countPerPage = countPerPage;
		this.nextFromPage = 1;
		this.totalCount = 0;
	}
}

class StaticPageInfo {
	constructor(countPerPage) {
		this.type = 'static';
		this.hasNext = true;
		this.page = 1;
		this.countPerPage = countPerPage;
	}
}

class ObjectsCache {
	constructor(name, globalId2Object) {
		this.name = name;
		this.objects = [];
		this.id2object = {};
		this.globalId2Object = globalId2Object;
	}

	/**
	 * 将对象加入缓存
	 * @param {*} object 
	 */
	add(object) {
		if (!this.globalId2Object[object.id]) {
			this.globalId2Object[object.id] = object;
		}

		let existed = this.id2object[object.id];
		if (!existed) {
			this.objects.push(object);
			this.id2object[object.id] = object;
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 将对象集合加入缓存，返回新对象集合
	 * @param {*} objects 
	 */
	addAll(objects) {
		let newObjects = [];
		objects.forEach((object) => {
			if (this.add(object)) {
				newObjects.push(object);
			} else {
				//
			}
		})

		return newObjects;
	}

	/**
	 * 获取id对应的object
	 * @param {*} id 
	 */
	get(id) {
		return this.id2object[id];
	}
}

class Service {
	constructor() {
		console.log('create base service');
		this.resource2pageinfo = {};
		this.resource2cache = {};
		this.id2object = {};
	}

	updatePageInfo(resource, pageinfoData) {
		let pageinfo = this.getPageInfo(resource);
		pageinfo.hasNext = pageinfoData['has_next'];
		pageinfo.nextFromId = pageinfoData['next_from_id'];
		pageinfo.nextFromPage = pageinfoData['next'];
		pageinfo.totalCount = pageinfoData['total_count'];

		LoadMoreService.updatePageInfo(pageinfo);
	}

	getPageInfo(resource, countPerPage=20) {
		let pageinfo = this.resource2pageinfo[resource];
		if (!pageinfo) {
			pageinfo = new PageInfo(countPerPage);
			this.resource2pageinfo[resource] = pageinfo;
		}

		return pageinfo;
	}

	getCache(resource) {
		let cache = this.resource2cache[resource];
		if (!cache) {
			cache = new ObjectsCache(resource, this.id2object);
			this.resource2cache[resource] = cache;
		}

		return cache;
	}

	getStaticPageInfo(resource, countPerPage=20) {
		let pageinfo = this.resource2pageinfo[resource];
		if (!pageinfo) {
			pageinfo = new StaticPageInfo(countPerPage);
			this.resource2pageinfo[resource] = pageinfo;
		}

		return pageinfo;
	}

	getCachedObject(id) {
		return this.id2object[id];
	}

	reset(resource) {
		if (resource) {
			delete this.resource2pageinfo[resource];
			delete this.resource2cache[resource];
		} else {
			this.resource2pageinfo = {};
			this.resource2cache = {};
		}
		console.debug(this.resource2pageinfo);
		console.debug(this.resource2cache);
	}
}

export default Service;