var filterList = [];
var filterNameList = [];
var activeFilters = {};
var activeItem;
var activeGallery;

var previousFilter = {
  
};

var generateItem = (_type, _index) => {
  switch (_type) {
    case "project":
      var p = DATA.projects[_index];
      return generateItemProject(
        p["imageNames"],
        p["captions"],
        p["name"],
        p["platform"],
        p["designers"],
        p["collaborators"],
        p["description"],
        p["video"]
      );
      break;
    case "thesis":
      var p = DATA.thesis[_index];
      return generateItemThesis(
        p["year"],
        p["imageNames"],
        p["captions"],
        p["name"],
        p["specialization"],
        p["description"],
        p["designers"],
        p["supervisors"],
        p["video"]
      );
      break;
    case "platform":
      var pla = DATA.platforms[_index];
      return generateItemPlatform(
        pla["name"],
        pla["date"],
        pla["leaders"],
        pla["collaborators"],
        pla["specialization"],
        pla["tags"],
        pla["description"],
        pla["projects"]
      );
      break;
    case "designer":
      var d = DATA.designers[_index];
      return generateItemDesigner(
        d["imageNames"],
        d["name"],
        d["class"],
        d["link"],
        d["projects"],
        d["thesis"]
      );
      break;
    case "leader":
      var l = DATA.leaders[_index];
      return generateItemLeader(
        l["imageNames"],
        l["name"],
        l["position"],
        l["active"],
        l["link"],
        l["email"],
        l["bio"],
        l["platforms"],
        l["thesis"]
      );
      break;
  }
};

var itemOnly = false;
var itemLoaded = false;

var loadNewItem = (_type, _index, _new) => {
  
  if (itemOnly && itemLoaded) return;
  
  var id;
  switch (_type) {
    case "project":
      id = DATA.projects[_index].id;
      break;
    case "thesis":
      id = DATA.thesis[_index].id;
      break;
    case "platform":
      id = DATA.platforms[_index].id;
      break;
    case "designer":
      id = DATA.designers[_index].id;
      break;
    case "leader":
      id = DATA.leaders[_index].id;
      break;
  }

  if (id !== activeItem) {
    activeItem = id;
    var itemHolder = document.querySelector(".item-holder");
    itemHolder.innerHTML = "";
    document.querySelector("#item-div").scrollTop = 0;

    // if (previousPage.length > 0) {
    //   var paramsArr = previousPage.split("?").at(-1).split("&");
    //   var obj = {};
    //   var params = paramsArr.forEach(p => {
    //     var pair = p.split("=");
    //     if (pair.length === 2) {
    //       obj[pair[0]] = pair[1];
    //     }
    //   });
    //   if (obj.mode !== "a") {
    //     var backButton = document.createElement("div");
    //     backButton.classList.add("item-back-button");
    //     backButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61 31"><polyline style="stroke:#f0f0f0;fill:none;stroke-linecap:round;stroke-linejoin:round;" points="60.5 15.5 .5 15.5 15.5 30.5 .5 15.5 15.5 .5"/></svg>`;
    //     backButton.addEventListener("click", (e) => {
    //       history.back();
    //     });
    //     itemHolder.append(backButton);
    //   }
    // }

    var backButton = document.createElement("div");
    backButton.classList.add("item-back-button");
    backButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61 31"><polyline style="stroke:#f0f0f0;fill:none;stroke-linecap:round;stroke-linejoin:round;" points="60.5 15.5 .5 15.5 15.5 30.5 .5 15.5 15.5 .5"/></svg>`;
    backButton.addEventListener("click", (e) => {
      history.back();
    });
    itemHolder.append(backButton);
    itemHolder.append(...generateItem(_type, _index).children);

    if (_new === undefined) {
      pushHistory();
    } else if (!_new) {
      replaceHistory();
    }
  }

  revealItem();
  
  var share = document.createElement("div");
  share.id = "share-div";
  share.innerHTML = 
    `<div id="share-link">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 64">
        <g id="Layer_2" data-name="Layer 2">
          <g id="Layer_1-2" data-name="Layer 1">
            <path d="M50,44a10,10,0,0,0-7.62,3.53L19.55,35a10,10,0,0,0,0-5.94L42.38,16.47A10,10,0,1,0,40.45,13L17.62,25.53a10,10,0,1,0,0,12.94L40.45,51A10,10,0,1,0,50,44Z"/>
          </g>
        </g>
      </svg>
      
      <span>Share</span>
    </div>
    <div id="share-warning"></div>`;
  
  itemHolder.append(share);
  
  document.querySelector("#share-link").addEventListener("mouseenter", e => {
    document.querySelector("#share-warning").innerHTML = "<span>copy link</span>";
  });
  
  document.querySelector("#share-link").addEventListener("mouseleave", e => {
    document.querySelector("#share-warning").innerHTML = "";
  });
  
  document.querySelector("#share-link").addEventListener("click", e => {
    var url = window.location.href;
    
    var copy = document.createElement("input");
    copy.value = url;
    
    copy.select();
    copy.setSelectionRange(0, 99999); /* For mobile devices */
    console.log(copy.value);
    navigator.clipboard.writeText(copy.value);
    
    document.querySelector("#share-warning").innerHTML = "<span>link copied</span>";
    
    setTimeout(() => {
      document.querySelector("#share-warning").innerHTML = "";
    }, 1000);
    
  });
  
  itemLoaded = true;
};

var loadNewGallery = (_type, _new, _newFilters) => {
  if (_type !== activeGallery) {
    
    previousFilter[activeGallery] = {
      list: filterList.map(f => f), 
      name: filterNameList.map(n => n),
    };
    
    activeGallery = _type;

    var filter;
    var gallery;
    if (document.querySelector("#gallery-menu .active")) {
      document
        .querySelector("#gallery-menu .active")
        .classList.remove("active");
    }
    switch (_type) {
      case "projects":
        filter = generateFilter("projects");
        gallery = loadProjectsGallery();
        document.querySelector("#projects-btn").classList.add("active");
        break;
      case "platforms":
        filter = generateFilter("platforms");
        gallery = loadPlatformsGallery();
        document.querySelector("#platforms-btn").classList.add("active");
        break;
      case "thesis":
        filter = generateFilter("thesis");
        gallery = loadThesisGallery();
        document.querySelector("#thesis-btn").classList.add("active");
        break;
      case "designers":
        filter = generateFilter("designers");
        gallery = loadDesignersGallery();
        document.querySelector("#designers-btn").classList.add("active");
        break;
      case "leaders":
        filter = generateFilter("leaders");
        gallery = loadLeadersGallery();
        document.querySelector("#leaders-btn").classList.add("active");
        break;
      case "search":
        filter = generateFilter("search");
        gallery = loadSearch();
        document.querySelector("#search-btn").classList.add("active");
        break;
    }
    
    if (previousFilter[activeGallery] !== undefined) {
      filterList = previousFilter[activeGallery].list.map(f => f);
      filterNameList = previousFilter[activeGallery].name.map(n => n);
    } else {
      filterList = [];
      filterNameList = [];
    }
    
    // console.log(activeGallery, previousFilter, filterList, filterNameList);

    document.querySelector("#gallery-filterbar").innerHTML = "";
    document.querySelector("#gallery-filterbar").append(filter);

    document.querySelector(".gallery-holder").innerHTML = "";
    document.querySelector(".gallery-holder").append(...gallery.children);

    document.querySelector(".gallery-holder").scrollTop = 0;

    if (_new === undefined) {
      pushHistory();
    } else if (!_new) {
      replaceHistory();
    }
    
    if (_newFilters === undefined) {
      activateFilters();
      loadCardImages();
    }
  }
};

const loadCardImages = () => {
  const cardArray = [...document.querySelectorAll("a.card:not(.viewed)")].filter(c => {
    const rect = c.getBoundingClientRect();
    if (rect.y > 0 && rect.y < window.innerHeight * 2) {
      c.classList.add("viewed");
      const img = c.querySelector(".card-image");
      if (img) {
        if (img.dataset.src) {
          img.style.backgroundImage = `url(${img.dataset.src})`;
        }
      }
    }
  });
}

var generateFilter = _type => {
  var filterBar = document.createElement("div");
  filterBar.classList.add("filter-bar");

  switch (_type) {
    case "projects":
      activeFilters = generateProjectsFilters();
      break;
    case "thesis":
      activeFilters = generateThesisFilters();
      break;
    case "platforms":
      activeFilters = generatePlatformsFilters();
      break;
    case "designers":
      activeFilters = generateDesignersFilters();
      break;
    case "leaders":
      activeFilters = generateLeadersFilters();
      break;
    case "search":
      activeFilters = {};
      break;
  }

  var filters = [];

  if (Object.keys(activeFilters).length > 0) {
    for (var f in activeFilters) {
      var filterCat = document.createElement("div");
      filterCat.classList.add("filter-cat");

      var catName = document.createElement("div");
      catName.classList.add("filter-cat-name");
      catName.innerHTML = f;
      
      catName.addEventListener("click", e => {
        e.target.parentNode.classList.toggle("active");
      });

      var item = [];
      activeFilters[f]["display"].forEach((d, i) => {
        var filterItem = document.createElement("div");
        filterItem.classList.add("filter-cat-item");
        filterItem.id = activeFilters[f]["id"][i];
        filterItem.innerHTML = d;

        filterItem.addEventListener("click", e => {
          applyFilters({
            id: filterItem.id,
            name: d
          });
        });

        item.push(filterItem);
      });

      filterCat.append(catName, ...item);

      filters.push(filterCat);
    }
    document.querySelector("#filter-btn").classList.remove("hidden");
  } else {
    document.querySelector("#filter-btn").classList.add("hidden");
  }

  filterBar.append(...filters);

  return filterBar;
};

var applyFilters = filter => {
  if (filter !== undefined) {
    var index = filterList.findIndex(f => f === filter.id);
    if (index < 0) {
      filterList.push(filter.id);
      filterNameList.push(filter.name);
    } else {
      filterList.splice(index, 1);
      filterNameList.splice(index, 1);
    }
  }

  activateFilters();
  loadCardImages();
};

var activateFilters = () => {
  var fbar = document.querySelector(".filter-bar");
  if (filterNameList.length > 0) {
    document.querySelector("#applied-filters").innerHTML = filterNameList.join(
      ", "
    );
  } else {
    document.querySelector("#applied-filters").innerHTML = "";
  }

  var cards = document.querySelectorAll(".gallery-holder .card");

  cards.forEach(c => {
    if (filterList.length === 0) {
      c.classList.remove("hidden");
    } else {
      
      for (var af in activeFilters) {
        activeFilters[af].filterList = filterList.filter(f => f.search(activeFilters[af].tag) === 0).length;
        activeFilters[af].active = 0;
        filterList.forEach(f => {
          if (f.search(activeFilters[af].tag) === 0) {
            if (c.classList.contains(f)) {
              activeFilters[af].active++;
            }
          }
        });
      }
      
      var show = true;
      for (var af in activeFilters) {
        if (activeFilters[af].and) {
          if (activeFilters[af].active !== activeFilters[af].filterList) {
            show = false;
          }
        } else {
          if (activeFilters[af].active < 1 && activeFilters[af].filterList > 0) {
            show = false;
          } 
        }
      }
      
      if (show) {
        c.classList.remove("hidden");
      } else {
        c.classList.add("hidden");
      }
    }
  });

  if (filterList.length > 0) {
    document.querySelector("#filter-btn").classList.add("filtered");
  } else {
    document.querySelector("#filter-btn").classList.remove("filtered");
  }

  var activeCards = document.querySelectorAll(
    ".gallery-holder .card:not(.hidden)"
  );

  var inactiveFilters = [];

  fbar.querySelectorAll(".filter-cat-item").forEach(f => {
    var index = filterList.findIndex(fil => fil === f.id);
    if (index < 0) {
      f.classList.remove("active");
    } else {
      f.classList.add("active");
    }
    inactiveFilters.push(f.id);
  });

  activeCards.forEach(c => {
    c.classList.forEach((t, i) => {
      var index = inactiveFilters.findIndex(f => f === t);
      if (index >= 0) {
        inactiveFilters.splice(index, 1);
      }
    });
  });

  fbar.querySelectorAll(".filter-cat-item").forEach(f => {
    f.classList.remove("hidden");
    var index = inactiveFilters.findIndex(fil => fil === f.id);
    if (index >= 0) {
      
      for (var af in activeFilters) {
        activeFilters[af].inactive = 0;
        filterList.forEach(f => {
          if (f.search(activeFilters[af].tag) === 0) {
            activeFilters[af].inactive++;
          }
        });
      }
      
      var hide = false;
      for (var af in activeFilters) {
        if (activeFilters[af].exclusive && activeFilters[af].inactive > 0) {
          hide = true;
        } else if (activeFilters[af].exclusive && inactiveFilters[index].search(activeFilters[af].tag) === 0) {
          hide = true;
        }
      }
      
      if (hide) {
        f.classList.add("hidden");
      }
    }
  });
  
  revealActiveFilters();
  replaceHistory();
}

var clearFilters = () => {
  filterList = [];
  filterNameList = [];
  applyFilters();
};

var revealActiveFilters = () => {
  document.querySelectorAll(".filter-cat").forEach(cat => {
    if (cat.querySelector(".filter-cat-item.active")) {
      cat.classList.add("active");
    }
  });
}

var loadSearch = () => {
  var holder = document.createElement("div");
  var search = document.createElement("div");
  search.id = "search-bar";

  var input = document.createElement("input");
  input.id = "search-value";
  input.type = "text";
  input.placeholder = "Search archive";

  var btn = document.createElement("div");
  btn.id = "run-search-btn";
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000000"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`;

  input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      input.blur();
      runSearch();
    }
  });

  btn.addEventListener("click", e => {
    runSearch();
  });

  var results = document.createElement("div");
  results.id = "search-results";

  search.append(input, btn);
  holder.append(search, results);

  return holder;
};

var runSearch = () => {
  if (document.querySelector("#search-value").value.length > 0) {

    if (document.querySelector("#search-value").value.toLowerCase().trim() === "lets play a game") {
      initGame();
      return;
    }

    var results = [];

    var terms = document
      .querySelector("#search-value")
      .value.trim()
      .split(" ");

    if (terms.length > 0) {
      DATA.projects.forEach((p, i) => {
        var count = 0;
        count += searchString(p.name, terms);
        count += searchString(p.description, terms);
        count += searchString(p.collaborators, terms);

        if (count > 0) {
          results.push({
            type: "project",
            index: i,
            item: p,
            count: count
          });
        }
      });

      DATA.thesis.forEach((p, i) => {
        var count = 0;
        count += searchString(p.name, terms);
        count += searchString(p.description, terms);

        if (count > 0) {
          results.push({
            type: "thesis",
            index: i,
            item: p,
            count: count
          });
        }
      });

      DATA.platforms.forEach((p, i) => {
        var count = 0;
        count += searchString(p.name, terms);
        count += searchString(p.description, terms);
        count += searchString(p.collaborators, terms);

        if (Array.isArray(p.partners)) {
          count += searchString(p.partners.join(" "), terms);
        }
        
        if (Array.isArray(p.tags)) {
          count += searchString(p.tags.join(" "), terms);
        }

        if (count > 0) {
          results.push({
            type: "platform",
            index: i,
            item: p,
            count: count
          });
        }
      });

      DATA.designers.forEach((p, i) => {
        var count = 0;
        count += searchString(p.name, terms);
        count += searchString(p.preferred, terms);

        if (count > 0) {
          results.push({
            type: "designer",
            index: i,
            item: p,
            count: count
          });
        }
      });

      DATA.leaders.forEach((p, i) => {
        var count = 0;
        count += searchString(p.name, terms);
        count += searchString(p.bio, terms);

        if (count > 0) {
          results.push({
            type: "leader",
            index: i,
            item: p,
            count: count
          });
        }
      });

      results.sort((a, b) => b.count - a.count);

      document.querySelector("#search-results").innerHTML = "";

      var resultsCount = document.createElement("div");
      resultsCount.id = "search-results-count";
      resultsCount.innerHTML = `${results.length} ${
        results.length === 1 ? "item" : "items"
      } found.`;

      document.querySelector("#search-results").append(resultsCount);

      results.forEach(r => {
        var resultCard;
        switch (r.type) {
          case "project":
            resultCard = generateGalleryCardProject(r.item, r.index);
            break;
          case "thesis":
            resultCard = generateGalleryCardThesis(r.item, r.index);
            break;
          case "platform":
            resultCard = generateGalleryCardPlatform(r.item, r.index);
            break;
          case "designer":
            resultCard = generateGalleryCardDesigner(r.item, r.index);
            break;
          case "leader":
            resultCard = generateGalleryCardLeader(r.item, r.index);
            break;
        }
        document.querySelector("#search-results").append(resultCard);
      });
    }
  }

  loadCardImages();
};

var searchString = (str, terms) => {
  var counter = 0;

  if (str !== undefined) {
    terms.forEach(t => {
      var index = str.toLowerCase().search(t.toLowerCase());
      if (index >= 0 && (index - 1 === -1 || str.charAt(index - 1) === " ")) {
        counter++;
      }
    });
  }

  return counter;
};


// game

let gameStart;
let gameEnd;
let gameInterval;
let gameCounter = 0;
let currItem;

const initGame = () => {

  if (gameInterval) clearInterval(gameInterval);

  gameCounter = 0;
  gameStart = returnRandomItem();
  currItem = gameStart.id;
  gameEnd = returnRandomItem();
  while (gameStart.id === gameEnd.id) {
    gameEnd = returnRandomItem();
  }

  document.querySelector("#game").innerHTML = `<div id="game-bar"><div id="game-counter"><span>${gameCounter}</span></div><div id="game-objective"><span>find:<br><b>${gameEnd.name}</b></span></div></div><lottie-player id="game-animation" src="https://assets2.lottiefiles.com/packages/lf20_obhph3sh.json"  background="transparent"  speed="1"></lottie-player>`;
  
  loadNewItem(gameStart.type, gameStart.index);
  revealItem();

  const player = document.querySelector("#game-animation");
  

  gameInterval = setInterval(() => {
    if (!itemActive) {
      document.querySelector("#game").innerHTML = `<div id="game-bar"><span>&#9760; game over &#9760;</span></div>`;
      clearInterval(gameInterval);
      gameInterval = setTimeout(() => {
        document.querySelector("#game").classList.remove("active");
      }, 3000);
    }

    if (currItem !== activeItem) {
      gameCounter++;
      document.querySelector("#game-counter").innerHTML = `<span>${gameCounter}</span>`;
      currItem = activeItem;
    }

    if (activeItem === gameEnd.id) {
      document.querySelector("#game").classList.add("success");
      player.play();
      clearInterval(gameInterval);
      gameInterval = setTimeout(() => {
        document.querySelector("#game").classList.remove("active");
      }, 4000);
    }
  }, 100);

  document.querySelector("#game").classList.remove("success");
  document.querySelector("#game").classList.add("active");

}

const returnRandomItem = () => {
  const total = DATA.projects.length + DATA.thesis.length + DATA.platforms.length + DATA.designers.length + DATA.leaders.length;
  let rand = Math.floor(total * Math.random());
  if (rand < DATA.projects.length) {
    return {id: DATA.projects[rand].id, name: DATA.projects[rand].name, type: "project", index: rand};
  } 
  rand -=  DATA.projects.length;
  if (rand < DATA.thesis.length ) {
    return {id: DATA.thesis[rand].id, name: DATA.thesis[rand].name, type: "thesis", index: rand};
  }
  rand -=  DATA.thesis.length;
  if (rand < DATA.platforms.length ) {
    return {id: DATA.platforms[rand].id, name: DATA.platforms[rand].name, type: "platform", index: rand};
  }
  rand -=  DATA.platforms.length;
  if (rand < DATA.designers.length ) {
    return {id: DATA.designers[rand].id, name: DATA.designers[rand].name, type: "designer", index: rand};
  }
  rand -=  DATA.designers.length;
  if (rand < DATA.leaders.length ) {
    return {id: DATA.leaders[rand].id, name: DATA.leaders[rand].name, type: "leader", index: rand};
  }
  return undefined;
}