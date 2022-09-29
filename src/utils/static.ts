//<img>动态src 静态资源的处理
export const getImg = (img: string) => {
  return new URL(`../assets/images/${img}`, import.meta.url).href
}
