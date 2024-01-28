
export const verifyUrl =  (url) => {
  try{
   return  atob(url)
  }catch(err){
    return url
  }
}
