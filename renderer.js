/**
 * 新建一个 renderer.js 脚本， 这个脚本使用 document.getElementById DOM 接口来替换 id 属性为 info 的 HTML 元素显示文本。
 */
const information = document.getElementById('info')
information.innerText = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`

document.getElementById('toggle-dark-mode').addEventListener('click', async () => {
    const isDarkMode = await window.darkMode.toggle()
    document.getElementById('theme-source').innerHTML = isDarkMode ? 'Dark' : 'Light'
})

document.getElementById('reset-to-system').addEventListener('click', async () => {
    await window.darkMode.system()
    document.getElementById('theme-source').innerHTML = 'System'
})

/**
 * 将信息通过刚刚定义的 'ping' 通道从渲染器发送至主进程当中。
 */
const func = async () => {
    const information = document.getElementById('ipc')
    const response = await window.versions.ping()
    information.innerText = `进程间通信：${response}`
    console.log(response) // 打印 'pong'
}
func()

