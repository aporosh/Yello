export const buildUrl = (url, params) => {
    let urlWithParams = url;

    Object.entries(params).forEach(([key, value], i) => {
        const sign = !i ? "?" : "&";
        urlWithParams += `${sign}${key}=${value}`;
    });
    
    return urlWithParams;
};

export function getChallIdFromUrl(url){
    let urlPrefix ='';

    if (url.indexOf("challenge")) {
        urlPrefix = "/challenge/"; 
    } else {
        if (url.indexOf("results")) {
            urlPrefix = "/results/"; 
        } 
        else return "No id"
    }
    
     console.log(url.slice(url.indexOf(urlPrefix) + urlPrefix.length))
    return url.slice(url.indexOf(urlPrefix) + urlPrefix.length);
  }
  
  export function getPathFromUrl(url){
    const newUrl = new URL(url);
    return newUrl.pathname.split("/")[1];
  }

  export function getPage() {
    const page = window.location.pathname.split('/')
    if (page.includes('results')) return 'results';
    else return page[1]
}