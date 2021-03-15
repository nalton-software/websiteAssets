const table = document.getElementById('mainLayoutTable');
const topbar = document.getElementById('topbar');
const sidebarHolder = document.getElementById('sidebarHolder');
const sidebar = document.getElementById('sidebar');
const mainCell = document.getElementById('mainCell');
const mainCellInternals = document.getElementById('mainCellInternals');
const sidebarButton = document.getElementById('sidebarButton');

let sidebarVisible = true;

const pageListUrl = '/websiteAssets/pagelist.txt';

function toggleSidebar(overrideToVisible=false) {
    // the override is needed in the first adjustment
    resizeMainAndSidebar();
    if (sidebarVisible && ! overrideToVisible) { // hide
        table.style.transform = `translateX(-${sidebarHolder.offsetWidth}px)`; // smooth movement
        sidebarVisible = false;

        setTimeout(function() {
        var viewportWidth = document.body.clientWidth;
        table.style.width = viewportWidth + sidebar.clientWidth + 'px';
        mainCell.style.maxWidth = viewportWidth + 'px';
        mainCell.style.width = viewportWidth + 'px';
        sidebarButton.innerHTML = 'Show all pages';
        }, 500);
    }
    else if (! sidebarVisible || overrideToVisible) { // show
        table.style.transform = 'translateX(0px)';
        sidebarVisible = true;

        setTimeout(function() {
        var viewportWidth = document.body.clientWidth;
        table.style.width = viewportWidth + 'px';
        mainCell.style.maxWidth = viewportWidth - sidebar.clientWidth + 'px';
        mainCell.style.width = viewportWidth - sidebar.clientWidth + 'px';
        sidebarButton.innerHTML = 'Hide all pages';
        }, 500);
    }
}

function createLink(text, href, container) {
    var anchor = document.createElement('a');
    anchor.innerHTML = text;
    anchor.href = href;
    anchor.style.fontFamily = 'Segoe UI", Tahoma, Geneva, Verdana, sans-serif';
    anchor.style.color = 'black';
    anchor.style.fontSize = '18px';
    container.appendChild(anchor);
}

function createBr(container) {
    var br = document.createElement('br');
    container.appendChild(br);
}

async function getLinksAndNames() {
    var response = await fetch(pageListUrl);
    var data = await response.text();
    return data;
}

var containerDiv = document.getElementById('sidebar');

async function makeLinks() { // fetch data from file, split up, turn into links
    var linkSTR = await getLinksAndNames();
    var linksAndNames = linkSTR.split('*');

    for (var i = 0; i < linksAndNames.length; i ++) {
        var linkAndName = linksAndNames[i].split('&');
        var name = linkAndName[0];
        var link = linkAndName[1];
        createLink(name, link, containerDiv);
        createBr(containerDiv); // for spacing
        createBr(containerDiv);
    }
}

function resizeMainAndSidebar() {
    var viewportHeight = document.body.clientHeight;
    var topbarHeight = topbar.clientHeight;
    var sidebarHeight = viewportHeight - topbarHeight - 30; // for padding and other weird small things
    /*if (mainCell.clientHeight >= sidebarHeight) {
        sidebarHeight = mainCell.clientHeight;
    }*/

    sidebarHolder.style.height = sidebarHeight + 'px';
    sidebarHolder.style.maxHeight = sidebarHeight + 'px';
    sidebar.style.height = sidebarHeight + 'px';

    // take 5 for some extra padding not in the sidebar
    var mainCellHeight = sidebarHeight - 5;
    mainCell.style.height = mainCellHeight + 'px';
    mainCell.style.maxHeight = mainCellHeight + 'px';
    mainCellInternals.style.maxHeight = mainCellHeight + 'px';
}

setTimeout(() => {
    var table = document.getElementById('mainLayoutTable');
    table.style.transition = 'transform 0.35s cubic-bezier(0.785, 0.135, 0.15, 0.86)'; // set transition after a short amount of time so it doesn't fire before the sidebar is hidden
    resizeMainAndSidebar();
}, 1);

makeLinks();
resizeMainAndSidebar();
setTimeout(resizeMainAndSidebar, 500); // in case the page is slow to load content (especially if created dynamically)
toggleSidebar(true);
setTimeout(() => toggleSidebar(true), 100);
setTimeout(() => toggleSidebar(true), 500);