var itemActive = true;

var dataLoadedSequence = () => {
  loadURL();

  window.addEventListener("popstate", function (e) {
    loadURL();
  });

  var platformsLink = document.createElement("span");
  platformsLink.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 31"><polyline points="0.5 15.5 30.5 15.5 15.5 0.5 30.5 15.5 15.5 30.5" style="fill: none;stroke: #F0F0F0;stroke-linecap:round;stroke-linejoin: round"/></svg> platforms gallery';
  platformsLink.addEventListener("click", (e) => {
    loadNewGallery("platforms");
    revealGallery();
  });

  var thesisLink = document.createElement("span");
  thesisLink.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 31"><polyline points="0.5 15.5 30.5 15.5 15.5 0.5 30.5 15.5 15.5 30.5" style="fill: none;stroke: #F0F0F0;stroke-linecap:round;stroke-linejoin: round"/></svg> thesis gallery';
    thesisLink.addEventListener("click", (e) => {
    loadNewGallery("thesis");
    revealGallery();
  });

  var designersLink = document.createElement("span");
  designersLink.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 31"><polyline points="0.5 15.5 30.5 15.5 15.5 0.5 30.5 15.5 15.5 30.5" style="fill: none;stroke: #F0F0F0;stroke-linecap:round;stroke-linejoin: round"/></svg> designers gallery';
  designersLink.addEventListener("click", (e) => {
    loadNewGallery("designers");
    revealGallery();
  });

  var leadersLink = document.createElement("span");
  leadersLink.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 31"><polyline points="0.5 15.5 30.5 15.5 15.5 0.5 30.5 15.5 15.5 30.5" style="fill: none;stroke: #F0F0F0;stroke-linecap:round;stroke-linejoin: round"/></svg> leaders gallery';
  leadersLink.addEventListener("click", (e) => {
    loadNewGallery("leaders");
    revealGallery();
  });

  document.querySelector("#welcome-gallery-links").innerHTML = "";
  document
    .querySelector("#welcome-gallery-links")
    .append(platformsLink, thesisLink, designersLink, leadersLink);

  var years = [];
  DATA.projects.forEach((p) => {
    var year = DATA.platforms[p.platform.index].date.substring(0, 4);
    if (years.findIndex((y) => y === year) < 0) {
      years.push(year);
    }
  });
  years.sort((a, b) => a - b);

  document.querySelector(
    "#stats-for-nerds"
  ).innerHTML = `This archive currently holds&mdash;<br><b>${
    DATA.projects.length
  }</b> projects by <b>${
    DATA.designers.length
  }</b> design students, <br>spanning <b>${
    DATA.platforms.length
  }</b> platforms from <b>${years[0]}&ndash;${
    years[years.length - 1]
  }</b>, <br>led by a team of <b>${DATA.leaders.length}</b> platform leaders.`;

  // document.querySelector("#projects-btn").addEventListener("click", e => {
  //   loadNewGallery("projects");
  // });
  
  document.querySelector("#mobile-gallery-btn").addEventListener("click", (e) => {
    revealGalleryMenu();
  });

  document.querySelector("#platforms-btn").addEventListener("click", (e) => {
    loadNewGallery("platforms");
    toggleGalleryMenu();
  });

  document.querySelector("#thesis-btn").addEventListener("click", (e) => {
    loadNewGallery("thesis");
    toggleGalleryMenu();
  });

  document.querySelector("#designers-btn").addEventListener("click", (e) => {
    loadNewGallery("designers");
    toggleGalleryMenu();
  });

  document.querySelector("#leaders-btn").addEventListener("click", (e) => {
    loadNewGallery("leaders");
    toggleGalleryMenu();
  });

  document.querySelector("#search-btn").addEventListener("click", (e) => {
    loadNewGallery("search");
    document.querySelector("#search-value").focus();
    toggleGalleryMenu();
  });

  document.addEventListener("click", (e) => {
    if (!itemActive) {
      if (
        e.target.id !== "filter-btn" &&
        e.target.id !== "gallery-filterbar" &&
        e.target.id !== "applied-filters" &&
        !e.target.classList.contains("filter-cat-item") &&
        !e.target.classList.contains("filter-cat") &&
        !e.target.classList.contains("filter-cat-name")
      ) {
        document.querySelector("#gallery-filterbar").classList.remove("active");
      }
      
    } else {
      if (e.target.id === "item-div") {
        revealGallery();
      }
    }
    e.stopPropagation();
  });
  
  document.querySelector(".gallery-holder").addEventListener("scroll", (e) => {
    hideGalleryMenu();
    document.querySelector("#gallery-filterbar").classList.remove("active");
  });
};

window.onload = () => {
  document.querySelector("#center-div").addEventListener("click", (e) => {
    document.querySelector("#item-div").classList.toggle("active");
    itemActive = !itemActive;
    replaceHistory();
    document.querySelector("#center-div").classList.toggle("active");
  });

  document.querySelector("#filter-btn").addEventListener("click", (e) => {
    document.querySelector("#gallery-filterbar").classList.toggle("active");
  });

  document.querySelector("#clear-filter-btn").addEventListener("click", (e) => {
    clearFilters();
    e.stopPropagation();
  });

  document.querySelector("#global-header").addEventListener("click", (e) => {
    showWelcome();
    revealItem(true);
  });

  dataLoadedSequence();
};

var revealItem = (show) => {
  if (!show) {
    hideWelcome();
  }
  document.querySelector("#item-div").classList.add("active");
  itemActive = true;
  document.querySelector("#center-div").classList.add("active");
  replaceHistory();
};

var revealGallery = () => {
  document.querySelector("#item-div").classList.remove("active");
  itemActive = false;
  document.querySelector("#center-div").classList.remove("active");
  replaceHistory();
};

var revealGalleryMenu = () => {
  if (!document.querySelector("#gallery-menu").classList.contains("open")) {
      document.querySelector("#gallery-menu").classList.toggle("open");
    }
}

var hideGalleryMenu = () => {
  if (document.querySelector("#gallery-menu").classList.contains("open")) {
      document.querySelector("#gallery-menu").classList.toggle("open");
    }
}

var toggleGalleryMenu = () => {
  document.querySelector("#gallery-menu").classList.toggle("open");
}

var returnGalleryOffset = () => {
  var gallery = document.querySelector("#gallery-div");
  var gbb = gallery.getBoundingClientRect();
  var offset = window.innerWidth - gbb.right;
  return offset;
};

var loadURL = () => {
  var params = new URLSearchParams(document.location.search);
  var _activeItem = params.get("item");
  var _activeGallery = params.get("gallery");
  var _filter = params.get("filter");
  var _mode = params.get("mode");

  if (
    _activeItem !== null &&
    _activeItem !== activeItem &&
    _activeItem !== ""
  ) {
    var findItem = {
      project: DATA.projects.findIndex((d) => d.id === _activeItem),
      thesis: DATA.thesis.findIndex((d) => d.id === _activeItem),
      platform: DATA.platforms.findIndex((d) => d.id === _activeItem),
      designer: DATA.designers.findIndex((d) => d.id === _activeItem),
      leader: DATA.leaders.findIndex((d) => d.id === _activeItem),
    };

    for (var i in findItem) {
      if (findItem[i] !== -1) {
        loadNewItem(i, findItem[i], false);
      }
    }
  } else if (_activeItem === null || _activeItem === "") {
    showWelcome(false);
  }

  if (
    _activeGallery !== null &&
    // _activeGallery !== activeGallery &&
    _activeGallery !== "" &&
    _activeGallery !== undefined
  ) {
    loadNewGallery(_activeGallery, false);
  } else {
    loadNewGallery("platforms", false);
  }

  if (_filter !== null && _filter.length > 0 && _filter !== "") {
    var _filterList = _filter.split("_");
    _filterList.shift();
    filterList = _filterList.map((f) => f);
    filterNameList = [];
    document.querySelectorAll(".filter-cat-item").forEach((f) => {
      filterList.forEach((fil) => {
        if (f.id === fil) {
          filterNameList.push(f.innerHTML);
        }
      });
    });
    applyFilters();

    revealActiveFilters();
  }

  switch (_mode) {
    case "a":
      revealGallery();
      break;
    case "e":
      document.querySelector("#global-header").remove();
      document.querySelector("#center-div").remove();
      document.querySelector("#gallery-div").remove();
      document.querySelector("#item-div").style.width = "100vw";
      document.querySelector("#item-div").style.height = "100vh";
      document.querySelector(".container").style.height = "100vh";
      itemOnly = true;
      break;
  }
};

var previousPage = "";
var pushHistory = () => {
  var filter = "";
  filterList.forEach((f) => {
    filter += `_${f}`;
  });
  var ref = `?mode=${itemActive ? "" : "a"}&item=${activeItem === undefined ? "" : activeItem}&gallery=${activeGallery}&filter=${filter}`;
  previousPage = ref;
  history.pushState(null, null, ref);
};

var replaceHistory = () => {
  var filter = "";
  filterList.forEach((f) => {
    filter += `_${f}`;
  });
  var ref = `?mode=${itemActive ? "" : "a"}&item=${activeItem === undefined ? "" : activeItem}&gallery=${activeGallery}&filter=${filter}`;
  history.replaceState(null, null, ref);
};

var showWelcome = (_new) => {
  document.querySelector("#welcome").classList.remove("hidden");
  document.querySelector("#item-div").scrollTop = 0 + "px";
  document.querySelector(".item-holder").innerHTML = "";
  activeItem = "";
  if (_new === undefined) {
    pushHistory();
  } else {
    replaceHistory();
  }
};

var hideWelcome = () => {
  document.querySelector("#welcome").classList.add("hidden");
};
