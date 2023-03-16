// ------------- LOADING PAGE ANIMATION -----------------

// function which checks every 2.5 secs to see if body loaded is "not undefined" - if body "not undefined", this means page load is complete, so clear the interval and break out of the function 
function onReady(callback) {
    let intervalId = window.setInterval(function () {
        if (document.getElementsByTagName('body')[0] !== undefined) {
            window.clearInterval(intervalId);
            callback.call(this);
        }
    }, 2500);
}
// function accepts 2 parameters - the selector and whether to that selector to visible or not. It uses a ternary operator, which says "if visible is true, then set the display attribute for that selector to block, otherwise set its display attribute to none" 
function setVisible(selector, visible) {
    document.querySelector(selector).style.visibility = visible ? 'visible' : 'hidden';
}

// call onReady, passing:
//      1. name of the selector and 
//      2. whether to display its content
// Once page loaded, set the loading page display to none and the document to display block
onReady(function () {
    setVisible('.after-loading-page', true);
    setVisible('#loading', false);
});

// ------------- End of LOADING PAGE ANIMATION -----------------



/*jshint esversion: 6 */
$(document).ready(function () {
    let url;
    let currentSelectedUser;


    // Get Config.Json and variable from it
    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success: function (configData) {
            console.log(configData.SERVER_URL, configData.SERVER_PORT);
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;

            getAllProjects();
            logIn();



        },
        error: function (error) {
            console.log(error);
        }
    });





    function getAllProjects() {

        $.ajax({
            url: `http://${url}/allPortfolios`,
            type: 'GET',
            dataType: 'json',
            success: function (productsFromMongo) {
                let projectsContainer = document.getElementById('projectsContainer');
                projectsContainer.innerHTML = '';

                for (let i = 0; i < productsFromMongo.length; i++) {
                    let project = productsFromMongo[i];
                    let createdBy = productsFromMongo[i].user_id;

                    let projectNumber; // creating a project number based on the number in the database
                    if (i < 9) {
                        projectNumber = "0" + (i + 1); // adding 0 to the front of the project number if below 10

                    } else {
                        projectNumber = i + 1;
                    }


                    //  Writing each item from the database to list in HTML using portfolio attributes

                    projectsContainer.innerHTML += `

                        <div class="project-listing " data-id=${project._id}>

                            <div class="name-container">
                                <h6 class="project-info number">${projectNumber}.</h6>
                                <h6 class="project-info title">${project.title}</h6>
                        </div>
                
                
                            <h6 class="project-info author"> ${project.author}</h6>
               
                         </div>
                `;

                    // runs function that gives each listing a click event to open the project
                    openProject();

                }
            },
            error: function () {
                popup('Unable to get all portfolios', 'error');
            }
        });

    }



    // opens more information about selected project
    function getSingleProject(id) {

        $.ajax({

            url: `http://${url}/singlePortfolio/${id}`, //gets single portfolio based on id passed from click event 
            type: 'GET',
            dataType: 'json',
            success: async function (portfolio) {


                let userID = portfolio.user_id;
                const selectedUser = await getSingleUser(userID);
                // retrieving and setting current user details



                populatingContent(portfolio, selectedUser);


            },
            error: function () {
                popup('unable to get single portfolio', 'error');
            }





        });

    };


    function singleProjectHover(id) {
        $.ajax({
            url: `http://${url}/singlePortfolio/${id}`,
            type: 'GET',
            dataType: 'json',
            success: function (portfolio) {
                let image = document.getElementById('projectImage');
                image.innerHTML = `
           <img src="${portfolio.imageURL}" >
           `;


            },
            error: function () {
                // alert('its not working');
            }


        });
    }

    async function getSingleUser(id) {

        let user;

        try {
            user = await $.ajax({
                url: `http://${url}/singleUser/${id}`,
                type: 'GET',
                dataType: 'json',

            });
            
            return user;

        } catch (error) {
            console.error(error);
        }

    }



    function responsivePopulate(portfolio, selectedUser, loggedUser) {

        if (loggedUser === portfolio.user_id) {
            projectInfoContainer.innerHTML = `
            <div class="responsive-project-container">
            <div class="r-author-name">${portfolio.author}</div>
            <div class="buttons-container" id="buttonsContainer">
            
                <button id="editProject" data-id=${portfolio._id} class="login-message round-button edit-button"><i class="fa-solid fa-pen"></i></button>
            <button id="deleteProject" data-id=${portfolio._id} class="login-message round-button delete-button"><i class="fa-solid fa-trash"></i></button>
                </div>
            <div class="r-project-name">${portfolio.title}</div>
            <div class="r-project-image" id="rProjectImage"><img src="${portfolio.imageURL}"></div>
            <div class="r-project-description"><p>${portfolio.description}</p></div>
            <div class="links-container" id='rlinksContainer'> </div>
                
            </div>
            `

            let rlinksContainer = document.getElementById('rlinksContainer');
            // let projectImage = document.getElementById('rProjectImage');
            // projectImage.style.backgroundImage = `url(${portfolio.imageURL})`
            // projectImage.style.backgroundImage = `url(${portfolio.imageURL})`

            if (selectedUser.twitter !== '') {
                rlinksContainer.innerHTML += `
            <a href="${selectedUser.twitter}"><i class="fa-brands fa-twitter link"></i></a>
            `

            }
            if (!selectedUser.instagram == '') {
                rlinksContainer.innerHTML += `
            <a href="${selectedUser.instagram}"><i class="fa-brands fa-instagram link"></i></a>
            `
            }
            if (!selectedUser.linkedIn == '') {
                rlinksContainer.innerHTML += `
            <a href="${selectedUser.linkedIn}"><i class="fa-brands fa-linkedin link"></i></a>
            `

            }
            if (!selectedUser.gitLink == '') {
                rlinksContainer.innerHTML += `
            <a href="${selectedUser.gitLink}"><i class="fa-brands fa-github link"></i></a>
            `

            }
            if (!selectedUser.externalSite == '') {
                rlinksContainer.innerHTML += `
            <a href="${selectedUser.externalSite}"><i class="fa-solid fa-globe"></i></a>
            `
            }
            editButtons(); //creates click events on edit buttons to open edit function
                deleteButtons();





        } else {
            projectInfoContainer.innerHTML = `
            <div class="responsive-project-container">
            <div class="r-author-name">${portfolio.author}</div>
            <div class="r-project-name">${portfolio.title}</div>
            <div class="r-project-image " id="rProjectImage"><img src="${portfolio.imageURL}"></div>
            <div class="r-project-description"><p>${portfolio.description}.</p></div>
            <div class="links-container" id='rlinksContainer'> 
                
            </div>
            </div>
            `

            let rlinksContainer = document.getElementById('rlinksContainer');
            // let projectImage = document.getElementById('rProjectImage');
            // projectImage.style.backgroundImage = `url(${portfolio.imageURL})`
            // projectImage.style.backgroundImage = `url(${portfolio.imageURL})`

            if (selectedUser.twitter !== '') {
                rlinksContainer.innerHTML += `
            <a href="${selectedUser.twitter}"><i class="fa-brands fa-twitter link"></i></a>
            `

            }
            if (!selectedUser.instagram == '') {
                rlinksContainer.innerHTML += `
            <a href="${selectedUser.instagram}"><i class="fa-brands fa-instagram link"></i></a>
            `
            }
            if (!selectedUser.linkedIn == '') {
                rlinksContainer.innerHTML += `
            <a href="${selectedUser.linkedIn}"><i class="fa-brands fa-linkedin link"></i></a>
            `

            }
            if (!selectedUser.gitLink == '') {
                rlinksContainer.innerHTML += `
            <a href="${selectedUser.gitLink}"><i class="fa-brands fa-github link"></i></a>
            `

            }
            if (!selectedUser.externalSite == '') {
                rlinksContainer.innerHTML += `
            <a href="${selectedUser.externalSite}"><i class="fa-solid fa-globe"></i></a>
            `
            }




        }

    }


    // populates content of single selected portfolio using the information of the selected user and the selected portfolio
    function populatingContent(portfolio, selectedUser) {
        let width = $(window).width(); //gets screen width for responsiveness
        let projectInfoContainer = document.getElementById('projectInfoContainer')
        let loggedUser = sessionStorage.getItem('userID'); //current logged in user from session storage (if someone is logged in)

        // checks if screen width is below phone size
        if (width <= 425) {
            responsivePopulate(portfolio, selectedUser, loggedUser) //populate code for mobile

        } else { // if screen width is above phone size

            if (loggedUser === portfolio.user_id) { //checks if the logged in user matched the current portfolio being viewed to add edit and delete buttons


                projectInfoContainer.innerHTML = `
            
                <div class="side1" id="side1">
                            
    
                        </div>
    
                        <div class="side2" id="side2">
    
                        </div>
                `

                let side1 = document.getElementById('side1');
                let side2 = document.getElementById('side2');
                side1.innerHTML = `
                <div class="buttons-container" id="buttonsContainer">
            
                <button id="editProject" data-id=${portfolio._id} class="login-message round-button edit-button"><i class="fa-solid fa-pen"></i></button>
            <button id="deleteProject" data-id=${portfolio._id} class="login-message round-button delete-button"><i class="fa-solid fa-trash"></i></button>
                </div>
        <div class="project-title"><h4>${portfolio.title}</h4></div>
        <div class="project-image" id="projectImage"> </div>
       
        
           
        </div>
        `

                side2.innerHTML = `
       <div class="project-author student-name">${portfolio.author}</div>
       <div class="project-description">
           <p>${portfolio.description}</p>
           
       </div>
       <div class="links-container" id="linksContainer">
            
            </div>
            


       `
                
                let linksContainer = document.getElementById('linksContainer');
                let projectImage = document.getElementById('projectImage');
                projectImage.style.backgroundImage = `url(${portfolio.imageURL})`

                // checks if the selected user(user who the portfolio belongs to) has link and populates icon with link if they do

                if (selectedUser.twitter !== '') {
                    linksContainer.innerHTML += `
                <a href="${selectedUser.twitter}"><i class="fa-brands fa-twitter link"></i></a>
                `

                }
                if (!selectedUser.instagram == '') {
                    linksContainer.innerHTML += `
                <a href="${selectedUser.instagram}"><i class="fa-brands fa-instagram link"></i></a>
                `
                }
                if (!selectedUser.linkedIn == '') {
                    linksContainer.innerHTML += `
                <a href="${selectedUser.linkedIn}"><i class="fa-brands fa-linkedin link"></i></a>
                `

                }
                if (!selectedUser.gitLink == '') {
                    linksContainer.innerHTML += `
                <a href="${selectedUser.gitLink}"><i class="fa-brands fa-github link"></i></a>
                `

                }
                if (!selectedUser.externalSite == '') {
                    linksContainer.innerHTML += `
                <a href="${selectedUser.externalSite}"><i class="fa-solid fa-globe"></i></a>
                `
                }
                editButtons(); //creates click events on edit buttons to open edit function
                deleteButtons(); //created click events on delete buttons to delete item from database


            } else { //same code as above but without edit and delete buttons
                projectInfoContainer.innerHTML = `
            
                <div class="side1" id="side1">
                            
    
                        </div>
    
                        <div class="side2" id="side2">
    
                        </div>
                `

                let side1 = document.getElementById('side1');
                let side2 = document.getElementById('side2');

                side1.innerHTML = `
        <div class="project-title"><h4>${portfolio.title}</h4></div>
        <div class="project-image" id="projectImage"></div>
           
        </div>
        `

                side2.innerHTML = `
       <div class="project-author student-name">${portfolio.author}</div>
       <div class="project-description">
           <p>${portfolio.description}</p>
           
       </div>
       <div class="links-container" id="linksContainer">
            
            </div>
       `
                let projectImage = document.getElementById('projectImage');
                let linksContainer = document.getElementById('linksContainer');
                projectImage.style.backgroundImage = `url(${portfolio.imageURL})`


                if (selectedUser.twitter !== '') {
                    linksContainer.innerHTML += `
                <a href="${selectedUser.twitter}"><i class="fa-brands fa-twitter link"></i></a>
                `

                }
                if (!selectedUser.instagram == '') {
                    linksContainer.innerHTML += `
                <a href="${selectedUser.instagram}"><i class="fa-brands fa-instagram link"></i></a>
                `
                }
                if (!selectedUser.linkedIn == '') {
                    linksContainer.innerHTML += `
                <a href="${selectedUser.linkedIn}"><i class="fa-brands fa-linkedin link"></i></a>
                `

                }
                if (!selectedUser.gitLink == '') {
                    linksContainer.innerHTML += `
                <a href="${selectedUser.gitLink}"><i class="fa-brands fa-github link"></i></a>
                `

                }
                if (!selectedUser.externalSite == '') {
                    linksContainer.innerHTML += `
                <a href="${selectedUser.externalSite}"><i class="fa-solid fa-globe"></i></a>
                `
                }
            }

        };




    };

    function editButtons() {
        let editbuttons = document.querySelectorAll('.edit-button');
        let buttons = Array.from(editbuttons);
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                
                let portfolioID = button.dataset.id;
                
                document.getElementById('sidenavTab').innerHTML = 'edit';
                editProject(portfolioID)
            })
        })
    };

    function deleteButtons() {
        let deletebuttons = document.querySelectorAll('.delete-button');
        let buttons = Array.from(deletebuttons);
        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                console.log('delete button clicked');
                let portfolioID = button.dataset.id;
                $.ajax({
                    url: `http://${url}/deletePortfolio/${portfolioID}`,
                    type: 'DELETE',
                    success: async function () {
                        
                        popup('Portfolio deleted', 'reg');
                        const user = await getSingleUser(sessionStorage.getItem('userID'))

                        populateUserInfo(user);
                        if (activeTab === 'tabAll') {
                            getAllProjects()
                        } else {
                            populateUserBio(sessionStorage.getItem('userID'));
                            getSingleStudentProjects(sessionStorage.getItem('userID'))
                        }
                    },
                    error: function () {
                        console.log('error: cannot delete due to call on api');
                    } // error                
                }); // ajax
            })
        })
    };

    function editProject(portfolioID) {
        
        const sideNav = document.getElementById('sidenav');
        const backgroundBlur = document.getElementById('backgroundBlur');

        backgroundBlur.classList.remove('hidden');
        sideNav.classList.remove('closed');
        sideNav.classList.add('open');

        const sideNavContent = document.getElementById('sidenavContent');

        sideNavContent.innerHTML = `
                                <div id="inputProjectDetails" class="input-Project-details">
                                    <br>
                                    <input class="input" type="text" id="projectName" placeholder="project name">
                                    <input class="input" type="text" id="projectDesc" placeholder="project description">
                                    <input class="input" type="text" id="projectURL" placeholder="link to project image">
                                    <input class="input" type="text" id="projectSite" placeholder="link to prject site">
                                    <br><br>
                                    <button id="submitEditProject" class="login-button">EDIT PROJECT</button>
                                </div>
                                `
        const submitEditProject = document.getElementById('submitEditProject');
        submitEditProject.addEventListener('click', function () {
            const newProjName = projectName.value;
            const newProjDesc = projectDesc.value;
            const newProjURL = projectURL.value;
            const newProjSite = projectSite.value;
           

          
            // *** Start of ajax POST
            $.ajax({
                url: `http://${url}/updatePortfolio/${portfolioID}`,
                type: 'PATCH',
                dataType: 'json',
                data: {
                    title: newProjName,
                    description: newProjDesc,
                    imageUrl: newProjURL,
                    siteUrl: newProjSite
                },
                success: async function (result) {
                
                    const user = await getSingleUser(sessionStorage.getItem('userID'))

                    populateUserInfo(user);
                    if (activeTab === 'tabAll') {
                        getAllProjects()
                    } else {
                        populateUserBio(sessionStorage.getItem('userID'));
                        getSingleStudentProjects(sessionStorage.getItem('userID'))
                    }
                    return;
                },
                error: function () {
                    console.log('Error - cannot call API to add a new project add product');
                }
            })

        });
    };

    function openProject() {
        let allListings = document.querySelectorAll('.project-listing');
        let listings = Array.from(allListings);



        listings.forEach(function (listing) {
            listing.addEventListener('click', function () {
               
                let projectID = listing.dataset.id;
                getSingleProject(projectID)

            });
            // listing.addEventListener('mouseover', function(){
            //     let projectID = listing.dataset.id;
            //     singleProjectHover(projectID)
            // })
            // listing.addEventListener('mouseout', function(){
            //     let image = document.getElementById('projectImage');
            //    image.innerHTML = `
            //    <img src="" >
            //    `
            // })
        })
    };


    async function populateUserBio(userID) {

        const user = await getSingleUser(userID)

        let projectInfoContainer = document.getElementById('projectInfoContainer')

        projectInfoContainer.innerHTML = `
                
                <div class="side1" id="side1">
                            
    
                        </div>
    
                        <div class="side2" id="side2">
    
                        </div>
                `
      
        let side2 = document.getElementById('side2');

        side2.innerHTML = `
                    <div class="project-author student-name">${user.firstName} ${user.lastName}</div>
                        <div class="project-description">
                           <p> ${user.bio}</p>
       
                            </div>
                        <div class="links-container" id="linksContainer">

        
                    </div>
                `

        let linksContainer = document.getElementById('linksContainer');

        if (user.twitter !== '') {
            linksContainer.innerHTML += `
                    <a href="${user.twitter}"><i class="fa-brands fa-twitter link"></i></a>
                    `

        }
        if (!user.instagram == '') {
            linksContainer.innerHTML += `
                    <a href="${user.instagram}"><i class="fa-brands fa-instagram link"></i></a>
                    `
        }
        if (!user.linkedIn == '') {
            linksContainer.innerHTML += `
                    <a href="${user.linkedIn}"><i class="fa-brands fa-linkedin link"></i></a>
                    `

        }
        if (!user.gitLink == '') {
            linksContainer.innerHTML += `
                    <a href="${user.gitLink}"><i class="fa-brands fa-github link"></i></a>
                    `

        }
        if (!user.externalSite == '') {
            linksContainer.innerHTML += `
                    <a href="${user.externalSite}"><i class="fa-solid fa-globe"></i></a>
                    `
        }



    };





    function getSingleStudentProjects(userID) {
        $.ajax({
            url: `http://${url}/allPortfolios`,
            type: 'GET',
            dataType: 'json',
            success: async function (productsFromMongo) {
                await populateUserBio(userID)


                let projectsContainer = document.getElementById('projectsContainer');
                projectsContainer.innerHTML = '';

                for (let i = 0; i < productsFromMongo.length; i++) {
                    let project = productsFromMongo[i];
                    let createdBy = productsFromMongo[i].user_id;
                    let projectNumber;



                    if (userID === createdBy) {
                        if (i < 9) {
                            projectNumber = "0" + (i + 1)

                        } else {
                            projectNumber = i + 1;
                        }





                        projectsContainer.innerHTML += `
                    <div class="project-listing " data-id=${project._id}>
    
                    <div class="name-container">
                        <h6 class="project-info number">${projectNumber}.</h6>
                    <h6 class="project-info title">${project.title}</h6>
                    </div>
                    
                    
                    <h6 class="project-info author"> ${project.author}</h6>
                   
                </div>
                    `;
                        openProject();
                    }


                }
            },
            error: function () {
                popup('Unable to get this students portfolio', 'error');
            }
        });
    };












    // ------------ TAB SELECTION LOGIC -------------

    let activeTab = 'tabAll';
    let activeResponsiveTab = 'tabAll'


    function changeTab(tabName) {



        // Setting the previous tab
        let prevTab = document.getElementById(activeTab);
        let prevTabName = prevTab.dataset.name + "-background"
        // prevTab.classList.remove('active');
        prevTab.classList.remove(prevTabName);

        // Setting the active tab
        activeTab = tabName;
        let tab = document.getElementById(activeTab);

        let activeTabName = tab.dataset.name + "-background"
        // tab.classList.add('active');
        tab.classList.add(activeTabName);

        let userID = tab.dataset.userid;



        if (activeTab === 'tabAll') {
            let projectInfoContainer = document.getElementById('projectInfoContainer')

            projectInfoContainer.innerHTML = `
                
                <div class="side1" id="side1">
                            
    
                        </div>
    
                        <div class="side2" id="side2">
    
                        </div>
                `
            let side1 = document.getElementById('side1');
            let side2 = document.getElementById('side2');
            side1.innerHTML = '';
            side2.innerHTML = '';
            getAllProjects();
        } else {
            let projectInfoContainer = document.getElementById('projectInfoContainer')

            projectInfoContainer.innerHTML = `
            
            <div class="side1" id="side1">
                        

                    </div>

                    <div class="side2" id="side2">

                    </div>
            `
            getSingleStudentProjects(userID);
            side1.innerHTML = '';
        }

    };








    function changeDropdownTab(tabName) {
        let prevTab = document.getElementById(activeResponsiveTab);
        let prevTabName = prevTab.dataset.background + "-background";

        let nameTab = document.getElementById('tabResponsiveName');
        nameTab.classList.remove(prevTabName);

        activeResponsiveTab = tabName;
        let tab = document.getElementById(activeResponsiveTab);

        let responsiveNav = document.getElementById('dropdownContainer');
        let dropdownTab = document.getElementById('tabDropdown')

        let userID = tab.dataset.userid;
        let name = tab.dataset.background;
        let tabBackground = name + '-background'
        nameTab.classList.add(tabBackground);


        if (tabName === 'dropdownTabAll') {
            let projectInfoContainer = document.getElementById('projectInfoContainer')

            projectInfoContainer.innerHTML = `
                
                <div class="side1" id="side1">   
    
                        </div>
    
                        <div class="side2" id="side2">
    
                        </div>
                `
            let side1 = document.getElementById('side1');
            let side2 = document.getElementById('side2');
            side1.innerHTML = '';
            side2.innerHTML = '';
            getAllProjects();
        } else {
            let projectInfoContainer = document.getElementById('projectInfoContainer')

            projectInfoContainer.innerHTML = `
            
            <div class="side1" id="side1">
                        

                    </div>

                    <div class="side2" id="side2">

                    </div>
            `
            side1.innerHTML = '';
            getSingleStudentProjects(userID);
        }




        nameTab.innerHTML = `${name}`;
        responsiveNav.classList.add('hiddenMenu');
        dropdownTab.style.backgroundColor = '$white';
        dropdownTab.style.color = '$black';


    };






    function tabsClickable() {

        let allTabs = document.querySelectorAll('.tab');
        let tabs = Array.from(allTabs);
        tabs.forEach(function (tab) {
            tab.addEventListener('click', event => {
               
                let tabName = event.target.id;

                changeTab(tabName);
            });

        });

    };

    // Adds click events to DROPDOWN TABS that gets there id(tabname) and passes to change tab function

    function dropdownClickable() {

        let allDropdownTabs = document.querySelectorAll('.dropdown-tab');
        let dropdownTabs = Array.from(allDropdownTabs);
        dropdownTabs.forEach(function (tab) {
            tab.addEventListener('click', event => {
                let tabName = event.target.id;
                changeDropdownTab(tabName);
            });

        });

    };

    // OPEN SIDE NAV CODE

    document.getElementById('sidenavTab').addEventListener('click', function () {

       
        const sideNav = document.getElementById('sidenav');
        const backgroundBlur = document.getElementById('backgroundBlur');

        if (!sideNav.classList.contains('open')) {
            backgroundBlur.style.animation = 'blurIn .5s linear'
          

            backgroundBlur.classList.remove('hidden');
            sideNav.classList.remove('closed');
            sideNav.classList.add('open');
        } else {
            backgroundBlur.style.animation = 'blurOut .5s linear'
           
            backgroundBlur.classList.add('hidden');
            sideNav.classList.remove('open');
            sideNav.classList.add('closed');
        }

    });

    

    // ------------ VISUALS -----------------

    function populateUserInfo(user) {
     

        let firstName = user.firstName;
        let lastName = user.lastName;
        let email = user.email;
        let password = user.password;
        let userImage = user.userImage;
        let gitLink = user.gitLink;
        let linkedIn = user.linkedIn;
        let instagram = user.instagram;
        let twitter = user.twitter;
        let externalSite = user.externalSite;


        if (userImage == '') {
            userImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
        }

      
        let sideNav = document.getElementById('sidenavContent');



        sideNav.innerHTML = `
        
    <div class="user-details-container">

    <h4>Good to see you back ${firstName}</h4>
        <div class="top-container">

            <div class="user-image" id='userImage'></div>
            <div class="user-name"><h3>${firstName} ${lastName}</h3></div>
            
        </div>
        <div class="info-container" id="infoContainer">
           
        </div>
        <button id="addProject" class="login-message login-button">Add Project</button>
        <button id="logOut" class="login-message login-button">Log out</button>

    </div>
    
        
        `
        let userImg = document.getElementById('userImage');
        userImg.style.backgroundImage = `url(${userImage})`;

        let infoContainer = document.getElementById("infoContainer");

        if (gitLink != '') {
            infoContainer.innerHTML += `
                        <div class="social-media-button"> <a href="${gitLink}" target="_blank" title="GitHub"><i class="fa-brands fa-github"></i></a> </div>
                `
        }
        if (linkedIn != '') {
            infoContainer.innerHTML += `
                        <div class="social-media-button"> <a href="${linkedIn}" target="_blank" title="Linked In"><i class="fa-brands fa-linkedin"></i></a> </div>
                `
        }
        if (instagram != '') {
            infoContainer.innerHTML += `
                        <div class="social-media-button"> <a href="${instagram}" target="_blank" title="Instagram"><i class="fa-brands fa-instagram"></i></a> </div>
                `
        }
        if (twitter != '') {
            infoContainer.innerHTML += `
                        <div class="social-media-button"> <a href="${twitter}" target="_blank" title="Twitter"><i class="fa-brands fa-twitter"></i></a> </div>
                `
        }
        if (externalSite != '') {
            infoContainer.innerHTML += `
                        <div class="social-media-button"> <a href="${externalSite}" target="_blank" title="Follow this link to view more of ${firstName}'s work"><i class="fa-solid fa-arrow-up-right-from-square"></i></a> </div>
                `
        }

        document.getElementById('sidenavTab').innerHTML = 'add';

        addNewProject(user, firstName);
        logOut();

    };

    function logIn(){
        document.getElementById('submitLogin').addEventListener('click', function () {

            // On click do an ajax call to the user collection and get their name to display on the welcome message
            let firstName = document.getElementById('firstName').value;
            let lastName = document.getElementById('lastName').value;
            let password = document.getElementById('password').value;
    
    
            if (firstName == '' || lastName == '' || password == '') {
               popup('Please enter all details', 'error')
    
                // alert('Please enter all details');
            } else {
    
                $.ajax({
                    url: `http://${url}/loginUser`,
                    type: 'POST',
                    data: {
                        firstName: firstName,
                        lastName: lastName,
                        password: password
                    },
                    success: function (user) {
    
                        if (user == 'user not found. Please register') {
                            popup('User not found. Please register', 'error');
                        } else if (user == 'not authorized') {
                            popup('Please try with correct details', 'error');
                            firstName.value('');
                            lastName.value('');
                            password.value('');
                        } else {
                            sessionStorage.setItem('userID', user['_id']);
                            sessionStorage.setItem('firstName', user['firstName']);
                            sessionStorage.setItem('lastName', user['lastName']);
                            populateUserInfo(user)
    
                        }
                    },
                    error: function () {
                        popup('Error - unable to get user details', 'error');
                    }
                });
    
            }
        });
            
    }

    function logOut(){
        document.getElementById('logOut').addEventListener('click', function(){
            sessionStorage.clear();
            let sideNav = document.getElementById('sidenavContent');
            sideNav.innerHTML = `
            <div class="login-form">
                    
    
                        <div id="inputUserDetails" class="input-user-details">
                            <br>
                            <input class="input" type="text" id="firstName" placeholder="First name...">
                            <input class="input" type="text" id="lastName" placeholder="Last name...">
                            <input class="input" type="password" id="password" placeholder="Password...">
                            <br><br>
                            <button class="login-button" id="submitLogin">Submit</button>
                        </div>
        
                        
        
                    </div>
           
            `

            logIn();
        })
    }



    function addNewProject(currentUser, firstName) {
        // * on click of the add project button, display add project form
        let sideNav = document.getElementById('sidenavContent');
        const addProject = document.getElementById('addProject');
        addProject.addEventListener('click', function () {
            sideNav.innerHTML = `
                                <div id="inputProjectDetails" class="input-Project-details">
                                    <br>
                                    <input class="input" type="text" id="projectName" placeholder="project name">
                                    <input class="input" type="text" id="projectDesc" placeholder="project description">
                                    <input class="input" type="text" id="projectURL" placeholder="link to project image">
                                    <input class="input" type="text" id="projectSite" placeholder="link to project site">
                                    <br><br><br><br>
                                    <button id="submitAddProject" class="login-button">ADD PROJECT NOW</button>
                                </div>
                                `

            // ** on click of the submit new project button, do an ajax call to add the project to the mongo DB
            const submitAddProject = document.getElementById('submitAddProject');
            submitAddProject.addEventListener('click', function () {
                const newProjName = projectName.value;
                const newProjDesc = projectDesc.value;
                const newProjURL = projectURL.value;
                const newProjSite = projectSite.value;
                const newProjCreateDate = new Date;
                const newProjCreator = sessionStorage.getItem('userID');
                const newProjAuthor = `${sessionStorage.getItem('firstName')} ${sessionStorage.getItem('lastName')}`;;
              
                // *** Start of ajax POST
                $.ajax({
                    url: `http://${url}/addPortfolio`,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        title: newProjName,
                        description: newProjDesc,
                        imageUrl: newProjURL,
                        siteUrl: newProjSite,
                        creationDate: newProjCreateDate,
                        user_id: newProjCreator,
                        author: newProjAuthor
                    },
                    success: function (result) {
                      
                        
                        popup(`Your project has been added to the portfolio database`, 'reg')
                        populateUserInfo(currentUser);
                        return;
                    },
                    error: function () {
                        console.log('Error - cannot call API to add a new project add product');
                    }
                })
                // End of ajax POST ***
            })
            // End of ** 
        })
        // End of *
    };
    // End of addNewProject(...)








    // ------------------------------- Login Form --------------------------------------


    // Add Project function - called after user successfully logs in

    function popup(message, type){
        let popupContainer = document.getElementById('popupContainer');
        let popupMessage = document.getElementById('popupMessage');
        let popup = document.getElementById('popup')

        if(type === 'error'){
            popup.style.backgroundColor = '#ff8181'
            popupContainer.classList.remove('closedPopup');
        popupMessage.innerHTML = `${message}`
        } else{
            popup.style.backgroundColor = '#F7F7F2'
            popupContainer.classList.remove('closedPopup');
        popupMessage.innerHTML = `${message}`
        }
        
    }



    // Add event listener to the login submit button
    // const loginButton = document.getElementById('submitLogin');
   
    // });



    // document.getElementById('logOut').addEventListener('click', function(){
    //     sessionStorage.clear();
    //     let sideNav = document.getElementById('sidenavContent');
    //     sideNav.innerHTML = `
    //     <div class="login-form">
                

    //                 <div id="inputUserDetails" class="input-user-details">
    //                     <br>
    //                     <input class="input" type="text" id="firstName" placeholder="First name...">
    //                     <input class="input" type="text" id="lastName" placeholder="Last name...">
    //                     <input class="input" type="password" id="password" placeholder="Password...">
    //                     <br><br>
    //                     <button class="login-button" id="submitLogin">Submit</button>
    //                 </div>
    
                    
    
    //             </div>
       
    //     `
    // })




    document.getElementById('tabDropdown').addEventListener('click', function () {
        let responsiveNav = document.getElementById('dropdownContainer');
        let dropdownTab = document.getElementById('tabDropdown')

        if (responsiveNav.classList.contains('hiddenMenu')) {
            responsiveNav.classList.remove('hiddenMenu')
            dropdownTab.style.backgroundColor = '$black'
            dropdownTab.style.color = '$white'
        } else {
            responsiveNav.classList.add('hiddenMenu')
            dropdownTab.style.backgroundColor = '$white'
            dropdownTab.style.color = '$black'
        }
    })

    document.getElementById('popupClose').addEventListener('click', function() {
        document.getElementById('popupContainer').classList.add('closedPopup');
    })



    // ------------------------------- End of Login Form --------------------------------------

    tabsClickable();
    dropdownClickable();


});