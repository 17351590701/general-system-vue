export type GoodModel = {
    goodId: string,
    goodName: string,
    description: string,
    price: string,
    pictureKey: string,
    categoryId: string,
    createTime: string,
    updateTime: string,

};
export type GoodListParam = {
    goodName: string,
    description: string,
    price: number,
    currentPage: number,
    pageSize: number,
    total: number
}
export type GoodCondition = {
    categoryIds: string,
    priceMin: string,
    priceMax: string
}
export type shopModel = {
    userId: string,
    goodId: string,
    buyNum: number,
    sum: number,
    address: string,
}
