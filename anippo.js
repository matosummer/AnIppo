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
  style.appendChild(doc.createTextNode(cssStyle))
  let button = doc.createElement("button")
  button.className = 'btn'
  button.id = "btn_copyurl"
  let textArea = doc.createElement("textarea")
  textArea.textContent = url
  textArea.select()
  button.innerHTML = "Copy Url"
  let buttonRefreshHttps = button.cloneNode()
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
      location.protocol = "https:";
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

browser.webRequest.onBeforeRequest.addListener(
  listener,
  {urls: ["http://*/*"], types: ["script"]},
  ["blocking"]
)

function listenerInternetPositif(details) {
  if(details.statusCode == 200) {
    let filter = browser.webRequest.filterResponseData(details.requestId)
    let inetPositip = false
    filter.ondata = event => {
      let eventData = event.data
      // check bytelength of internetpositif page
      if(event.data.byteLength >= 20000 && event.data.byteLength <= 80000) {
        let decoder = new TextDecoder("utf-8")
        let str = decoder.decode(event.data.slice(0, 2000))
        let domParser = new DOMParser()
        let doc = domParser.parseFromString(str, "text/html")
        let metaDesc = doc.head.querySelector("[name=description]").content
        if(
            doc.title === "Internet Positif" &&
            metaDesc === "Internet Positif"
          ) 
        {
            str = CreateLayoutDoc(details.url)
            let encoder = new TextEncoder()
            eventData = encoder.encode(str)
            inetPositip = true
        }
      }

      filter.write(eventData)

      if(inetPositip)
        filter.close()
      else
        filter.disconnect()
      
    }
  }
}

browser.webRequest.onHeadersReceived.addListener(
  listenerInternetPositif,
  {urls: ["http://*/*"], types: ["main_frame"]},
  ["blocking", "responseHeaders"]
)