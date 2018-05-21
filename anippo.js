const inetpositipUrl = "http://internetpositif.uzone.id/"

function CreateLayoutDoc(url) {
  const doc = document.implementation.createHTMLDocument("NO >:(")
  let main = doc.createElement("main")
  let page = doc.createElement("p")
  let br = doc.createElement("br")
  page.innerHTML = "Internet positif berulah mau di redirect, use vpn ato coba cek https <br> pencet <strong>R</strong> untuk coba refresh dengan protocol https"
  // Style
  let cssStyle = `
  .btn { background-color: #00BCD4;
  width: 200px; 
  height: 50px;
  border: none;
  margin-bottom: 20px;
  color: white;
  font-size: 1.4em;}`
  let style = doc.createElement('style')
  style.setAttribute('type', 'text/css')
  style.appendChild(doc.createTextNode(cssStyle))
  let button = doc.createElement("button")
  button.className = 'btn'
  button.id = "btn_copyurl"
  let textArea = doc.createElement("textarea")
  textArea.textContent = url
  textArea.select()
  button.innerHTML = "Copy Url"
  let buttonRefreshHttps = button.cloneNode()
  buttonRefreshHttps.className = 'btn'
  buttonRefreshHttps.innerHTML = "Try HTTPS"
  buttonRefreshHttps.id = "btn_refreshhttps"

  let hate = doc.createElement("p")
  hate.innerHTML = "❤️ INETPOSITIP ❤️"

  let script = doc.createElement("script")
  script.type = "text/javascript"
  script.innerHTML = `//<![CDATA[
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelector("#btn_copyurl").addEventListener("click", () => {
        document.querySelector("textarea").select()
        document.execCommand("copy")
      })
      document.querySelector("#btn_refreshhttps").addEventListener("click", () => {
        TryHttps()
      })
      document.addEventListener("keydown", (e) => {
        if(e.keyCode == 82) {
          TryHttps()
        }
      })
    })
    function TryHttps() {
      let _url = document.querySelector("textArea").innerHTML
      location.href = "https:" + _url.substring(window.location.protocol.length);
    }
  //]]> `
  doc.head.appendChild(style)
  doc.head.appendChild(script)
  main.appendChild(page)
  main.appendChild(buttonRefreshHttps)
  main.appendChild(br.cloneNode())
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
  if(
    details.url.includes("uzone.id") ||
    details.url.includes("notifa.info")
  ) {
    return { cancel:true }
  }

  return {}
}

let requestUrl = null

function listenerOnbeforeSendHeader(details) {
    if(details.url !== inetpositipUrl)
      requestUrl = details.url
}

browser.webRequest.onBeforeSendHeaders.addListener(
  listenerOnbeforeSendHeader,
  {urls: ["http://*/*"]},
  ["blocking","requestHeaders"]
)
browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["http://*/*"], types: ["script"]},
  ["blocking"]
)

function listenerInternetPositif(details) {
  if(details.statusCode == 200) {
    if(details.url === inetpositipUrl) {
      let filter = browser.webRequest.filterResponseData(details.requestId)
      filter.ondata = event => {
        str = CreateLayoutDoc(requestUrl)
        let encoder = new TextEncoder()
        let eventData = encoder.encode(str)
        filter.write(eventData)
        filter.close()
      }
    }
  }
}

browser.webRequest.onHeadersReceived.addListener(
  listenerInternetPositif,
  {urls: ["http://*/*"]},
  ["blocking", "responseHeaders"]
)
