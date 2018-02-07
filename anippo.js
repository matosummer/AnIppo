function CreateLayoutDoc(url) {
  const doc = document.implementation.createHTMLDocument("NO >:(")
  let main = doc.createElement("main")
  let page = doc.createElement("p")
  let br = doc.createElement("br")
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

function listener(details) {
  if(details.method !== "GET")
    return {}

  // Block ads host
  if(details.url.includes("cfs.uzone.id")) {
    return { cancel:true }
  }

  return {}
}

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["http://*/*"], types: ["script"]},
  ["blocking"]
)

function listenerInternetPositif(details) {
  console.log(details.statusCode)
  if(details.statusCode == 200) {
    let filter = browser.webRequest.filterResponseData(details.requestId)
    filter.ondata = event => {
      let eventData = event.data;
      // Inet positif page kinda always same, and byte length is less than 4000
      if(event.data.byteLength >= 800 && event.data.byteLength <= 4000) {
        let decoder = new TextDecoder("utf-8")
        // Sometimes the page get injected by ads so the byte length increased
        let str = decoder.decode(event.data.slice(event.data.byteLength - 2100, event.data.byteLength))
        let title = "window.location.replace(\"http://internetpositif.uzone.id"
        if(str.includes(title)) {
          console.log(str)
          str = CreateLayoutDoc(details.url)
          let encoder = new TextEncoder()
          eventData = encoder.encode(str)
        }
      }
      filter.write(eventData)
      filter.disconnect()
    }
  }
}

browser.webRequest.onHeadersReceived.addListener(
  listenerInternetPositif,
  {urls: ["http://*/*"], types: ["main_frame"]},
  ["blocking", "responseHeaders"]
);