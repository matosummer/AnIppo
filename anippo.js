function CreateLayoutDoc(url) {
  const doc = document.implementation.createHTMLDocument("NO >:(")
  let main = doc.createElement("main");
  let page = doc.createElement("p")
  let br = doc.createElement("br");
  page.innerHTML = "Internet positif berulah mau di redirect, use vpn ato coba cek https"
  let button = doc.createElement("button")
  button.style = `
      background-color: #00BCD4;
      width: 200px; 
      height: 50px;
      border: none;
      margin-bottom: 20px;
      color: white;
      font-size: 1.4em;`
  let textArea = doc.createElement("textarea")
  textArea.textContent = url;
  textArea.select();
  button.innerHTML = "Copy Url"
  
  let hate = doc.createElement("p")
  hate.innerHTML = "❤️ INETPOSITIP ❤️"

  let script = doc.createElement("script")
  script.type = "text/javascript"
  script.innerHTML = `//<![CDATA[
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelector("button").addEventListener("click", () => {
        document.querySelector("textarea").select()
        document.execCommand("copy")
      })
    })
  //]]> `
  doc.head.appendChild(script)
  main.appendChild(page)
  main.appendChild(button)
  main.appendChild(br)
  main.appendChild(textArea)
  main.appendChild(hate)
  doc.body.appendChild(main)
  return doc.documentElement.outerHTML
}

// TODO: faster Textdecoder
function listener(details) {
  if(details.method !== "GET")
    return {}

  if(details.type == "main_frame") {

    // I don't know why link to or from youtube crashing the browser
    // my guess is bug from firefox in filterResponseData
    const ignoreSite = [
      "youtu.be",
      "youtube.com",
    ]

    if(ignoreSite.find((i)=>details.url.includes(i)) != undefined)
      return {}
    
    let filter = browser.webRequest.filterResponseData(details.requestId)
    filter.ondata = event => {

      // Inet positif page kinda always same, and byte length is less than 5500
      if(event.data.byteLength >= 2000 && event.data.byteLength <= 5500) {
        let decoder = new TextDecoder("utf-8")
        let str = decoder.decode(event.data.slice(100, 500))
        let title = "<title>Internet Positif</title>"
        if(str.includes(title)) {
          str = CreateLayoutDoc(details.url)
          let encoder = new TextEncoder()
          filter.write(encoder.encode(str))
          filter.disconnect()
          return
        }
      }

      filter.write(event.data)
      filter.disconnect()
    }
  } else if(details.type == "script") {
    // Block ads host
    if(details.url.includes("cfs.uzone.id")) {
      return { cancel:true }
    }
  }
  return {}
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["<all_urls>"], types: ["main_frame", "script"]},
  ["blocking"]
)
