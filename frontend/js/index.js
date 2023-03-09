/*jshint esversion: 6 */



// ------------ TAB SELECTION LOGIC -------------

let activeTab = 'tabAll';




function allTab (){

}

function changeTab (tabName){
    

    let prevTab = document.getElementById(activeTab);
    prevTab.classList.remove('active');
    activeTab = tabName;
    let tab = document.getElementById(activeTab);
    tab.classList.add('active');
    console.log(`tab ${activeTab} is selected`);
    


}

function tabsClickable (){

    let allTabs = document.querySelectorAll('.tab');
    let tabs = Array.from(allTabs);
    tabs.forEach(function (tab){
        tab.addEventListener('click', event => {
            let tabName = event.target.id;
           
            changeTab(tabName)
        })
    })
}





document.getElementById('sidenavTab').addEventListener('click', function (){
    const sideNav = document.getElementById('sidenav');

    if (!sideNav.classList.contains('open')){
        sideNav.classList.remove('closed')
        sideNav.classList.add('open')
    } else {
        sideNav.classList.remove('open')
        sideNav.classList.add('closed')
    }
    
}) ;
tabsClickable();