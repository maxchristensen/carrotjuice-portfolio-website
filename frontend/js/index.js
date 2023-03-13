/*jshint esversion: 6 */
$(document).ready(function () {
    let url;


    // Get Config.Json and variable from it
    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success: function (configData) {
            console.log(configData.SERVER_URL, configData.SERVER_PORT);
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
            console.log('working');
            getAllProjects();

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
                    let projectNumber;
                    if (i < 9) {
                        projectNumber = "0" + (i + 1);

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
            },
            error: function () {
                alert('unable to get products');
            }
        });

    }

    function openProject() {
        let allListings = document.querySelectorAll('.project-listing');
        let listings = Array.from(allListings);



        listings.forEach(function (listing) {
            listing.addEventListener('click', function () {
                console.log('clicked');
                let projectID = listing.dataset.id;
                getSingleProject(projectID);

            });
            //             listing.addEventListener('mouseover', function () {
            //                 let projectID = listing.dataset.id;
            //                 singleProjectHover(projectID);
            //             });
            //             listing.addEventListener('mouseout', function () {
            //                 let image = document.getElementById('projectImage');
            //                 image.innerHTML = `
            //    <img src="" >
            //    `;
            //             });
        });
    }

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

    function getSingleProject(id) {

        $.ajax({
            url: `http://${url}/singlePortfolio/${id}`,
            type: 'GET',
            dataType: 'json',
            success: function (portfolio) {
                let projectInfoContainer = document.getElementById('projectInfoContainer');
                let side1 = document.getElementById('side1');
                let side2 = document.getElementById('side2');
                let linksContainer = document.getElementById('linksContainer');

                getUser(portfolio.user_id);
                let authorTwitter = sessionStorage.getItem('currentAuthorTwitter');
                let authorGit = sessionStorage.getItem('currentAuthorGitLink');

                // console.log(author);


                side1.innerHTML = `
            <div class="project-title"><h4>${portfolio.title}</h4></div>
            <div class="project-image">
                <img src="${portfolio.imageURL}" >
            </div>
            `;

                side2.innerHTML = `
           <div class="project-author student-name"><h3>${portfolio.author}</h3></div>
           <div class="project-description">
               <p>${portfolio.description}</p>
               
           </div>
           <div class="links-container" id="linksContainer">
           <i class="fa-brands fa-instagram"></i>
           <i class="fa-brands fa-linkedin"></i>
           <i class="fa-brands fa-github"></i>
           <i class="fa-solid fa-globe"></i>
                
                </div>
           `;

                //    if(!author.twitter == ' '){
                //     linksContainer.innerHTML += `
                //     <a href="${author.twitter}"><i class="fa-brands fa-twitter"></i></a>
                //     `

                //    } if(!author.instagram == ' '){
                //     linksContainer.innerHTML += `
                //     <a href="${author.instagram}"><i class="fa-brands fa-instagram"></i></a>
                //     `
                //    } if(!author.linkedIn == ' '){
                //     linksContainer.innerHTML += `
                //     <a href="${author.linkedIn}"><i class="fa-brands fa-linkedin"></i></a>
                //     `

                //    } 
                // if(!authorGit == ' '){
                //     linksContainer.innerHTML += `
                //     <a href="${authorGit}"><i class="fa-brands fa-github"></i></a>
                //     `

                //    } 
                //    if(!author.externalSite == ''){
                //     linksContainer.innerHTML += `
                //     <a href="${author.externalSite}"><i class="fa-brands fa-globe"></i></a>
                //     `
                //    }



            },
            error: function () {
                alert('unable to get products');
            }


        });
    }

    function getUser(id) {

        let author;


        $.ajax({
            url: `http://${url}/singleUser/${id}`,
            type: 'GET',
            dataType: 'json',
            success: function (user) {

            }

        });
    }


    function getSingleStudentProjects(userID) {
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
                alert('unable to get products');
            }
        });
    }






    // ------------ TAB SELECTION LOGIC -------------

    let activeTab = 'tabAll';

    let marianTab = document.getElementById('tabMarian');
    let maxTab = document.getElementById('tabMax');
    let christineTab = document.getElementById('tabChristine');
    let davidTab = document.getElementById('tabDavid');
    let samTab = document.getElementById('tabSam');
    let patriciaTab = document.getElementById('tabPatricia');
    let indiaTab = document.getElementById('tabIndia');




    function allTab() {

    }

    function changeTab(tabName) {


        marianTab.classList.remove('marian-background');
        maxTab.classList.remove('max-background');
        christineTab.classList.remove('christine-background');
        davidTab.classList.remove('david-background');
        samTab.classList.remove('sam-background');
        patriciaTab.classList.remove('patricia-background');
        indiaTab.classList.remove('india-background');


        let prevTab = document.getElementById(activeTab);
        prevTab.classList.remove('active');
        activeTab = tabName;
        let tab = document.getElementById(activeTab);
        tab.classList.add('active');
        console.log(`tab ${activeTab} is selected`);
        let userID = tab.dataset.userid;

        switch(activeTab) {

            case 'tabMarian':
                marianTab.classList.add('marian-background');
                break;

            case 'tabMax':
                maxTab.classList.add('max-background');
                break;
        
            case 'tabChristine':
                christineTab.classList.add('christine-background');
                break;
        
            case 'tabDavid':
                davidTab.classList.add('david-background');
                break;
        
            case 'tabSam':
                samTab.classList.add('sam-background');
                break;
        
            case 'tabPatricia':
                patriciaTab.classList.add('patricia-background');
                break;
        
            case 'tabIndia':
                indiaTab.classList.add('india-background');
                break;
            }


        if (activeTab === 'tabAll') {
            getAllProjects();
        } else {
            getSingleStudentProjects(userID);
        }

    }

    function getSingleStudentProjects(userID) {
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
                alert('unable to get products');
            }
        });
    }



    function tabsClickable() {

        let allTabs = document.querySelectorAll('.tab');
        let tabs = Array.from(allTabs);
        tabs.forEach(function (tab) {
            tab.addEventListener('click', event => {
                let tabName = event.target.id;

                changeTab(tabName);
            });

        });



        if (activeTab === 'tabAll') {
            getAllProjects();
        } else {
            getSingleStudentProjects(userID);
        }


    }







    document.getElementById('sidenavTab').addEventListener('click', function () {

        console.log('sidebar clicked');
        const sideNav = document.getElementById('sidenav');
        const backgroundBlur = document.getElementById('backgroundBlur');

        if (!sideNav.classList.contains('open')) {

            backgroundBlur.classList.remove('hidden');
            sideNav.classList.remove('closed');
            sideNav.classList.add('open');
        } else {
            backgroundBlur.classList.add('hidden');
            sideNav.classList.remove('open');
            sideNav.classList.add('closed');
        }

    });

    // ------------ VISUALS -----------------




    // ------------------------------- Login Form --------------------------------------


    // Add Project function - called after user successfully logs in

    function addNewProject(currentUser, greetingName) {
        // * on click of the add project button, display add project form
        const addProject = document.getElementById('addProject');
        addProject.addEventListener('click', function () {
            loginMessage.innerHTML = `
                                <div id="inputProjectDetails" class="input-Project-details">
                                    <br>
                                    <input class="input" type="text" id="projectName" placeholder="project name">
                                    <input class="input" type="text" id="projectDesc" placeholder="project description">
                                    <input class="input" type="text" id="projectURL" placeholder="link to project image">
                                    <input class="input" type="text" id="projectSite" placeholder="link to prject site">
                                    <br><br>
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
                const newProjCreateDate = "string";
                const newProjCreator = currentUser;
                const newProjAuthor = "string";
                console.log(newProjName);
                console.log(newProjDesc);
                console.log(newProjCreator);
                console.log('you have added a new project with the name "' + newProjName + '", description "' + newProjDesc + '"');
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
                        console.log(result);
                        alert('Project added by ' + greetingName);
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



    // Add event listener to the login submit button
    const loginButton = document.getElementById('submitLogin');
    loginButton.addEventListener('click', function () {

        // On click do an ajax call to the user collection and get their name to display on the welcome message
        const loginUser = document.getElementById('loginUser');
        const currentUser =  loginUser.value;

        $.ajax({
            url: `http://${url}/singleUser/${currentUser}`,
            type: 'GET',
            dataType: 'json',
            success: function (user) {
                const inputUserDetails = document.getElementById('inputUserDetails');
                inputUserDetails.innerHTML = '';
                const greetingName = user.firstName;
                const loginMessage = document.getElementById('loginMessage');
                // Display greeting and an 'add project' button
                loginMessage.innerHTML = `
                                <br><br>
                                <h4>Good to see you back ${greetingName}</h4>
                                <br><br>
                                <button id="addProject" class="login-message login-button">Add Project</button>
                                `
                addNewProject(currentUser, greetingName);
            },
            error: function () {
                alert('Error - unable to get user details');
            }
        });
    })

    // ------------------------------- End of Login Form --------------------------------------

    tabsClickable();



    // ------------ VISUALS -----------------




    
});