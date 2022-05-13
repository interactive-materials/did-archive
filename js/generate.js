//Generates a list of "Projects"

var generateProjectsFilters = () => {
  var years = [];
  var specializations = [];
  var tags = [];
  DATA.projects.forEach(p => {
    var year = DATA.platforms[p.platform.index].date.substring(0, 4);
    if (years.findIndex(y => y === year) < 0) {
      years.push(year);
    }
    if (p.specialization) {
      p.specialization.forEach(s => {
        if (specializations.findIndex(sp => sp === s) < 0) {
          specializations.push(s);
        }
      });
    }
  });

  years.sort((a, b) => +b - +a);
  specializations.sort();

  var obj = {
    Year: {
      display: years.map(y => y),
      id: years.map(y => `year-${y}`),
      tag: "year",
      and: false,
      exclusive: false,
    },
    Specialization: {
      display: specializations.map(s => s),
      id: specializations.map(s => `spec-${s.replace(/[ &]/g, "")}`),
      tag: "spec",
      and: false,
      exclusive: false,
    }
  };

  return obj;
};

var generatePlatformsFilters = () => {
  var years = [];
  var specializations = [];
  var tags = [];
  var partners = [];
  DATA.platforms.forEach(p => {
    var year = p.date.substring(0, 4);
    if (years.findIndex(y => y === year) < 0) {
      years.push(year);
    }
    if (p.specialization) {
      p.specialization.forEach(s => {
        if (specializations.findIndex(sp => sp === s) < 0) {
          specializations.push(s);
        }
      });
    }
    if (p.tags) {
      p.tags.forEach(t => {
        if (tags.findIndex(tg => tg === t) < 0) {
          tags.push(t);
        }
      });
    }
    if (p.partners) {
      p.partners.forEach(p => {
        if (partners.findIndex(pa => pa === p) < 0) {
          partners.push(p);
        }
      })
    }
  });

  years.sort((a, b) => +b - +a);
  specializations.sort();
  tags.sort();
  partners.sort();

  var obj = {
    Year: {
      display: years.map(y => y),
      id: years.map(y => `year-${y}`),
      tag: "year",
      and: false,
      exclusive: false,
    },
    Specialization: {
      display: specializations.map(s => s),
      id: specializations.map(s => `spec-${s.replace(/[ &]/g, "")}`),
      tag: "spec",
      and: false,
      exclusive: false,
    },
    Tags: {
      display: tags.map(t => t),
      id: tags.map(t => `tag-${t.replace(/[ &]/g, "")}`),
      tag: "tag",
      and: false,
      exclusive: true,
    },
    "External Partners": {
      display: partners.map(p => p),
      id: partners.map(p => `partner-${p.replace(/[ &]/g, "")}`),
      tag: "partner",
      and: false,
      exclusive: true,
    }
  };

  return obj;
};

var generateDesignersFilters = () => {
  var years = [];
  var specializations = [];
  var tags = [];
  DATA.designers.forEach(p => {
    var year = p.class;
    if (years.findIndex(y => y === year) < 0) {
      years.push(year);
    }
  });

  years.sort((a, b) => +b - +a);

  var obj = {
    "Graduating Class": {
      display: years.map(y => y),
      id: years.map(y => `year-${y}`),
      tag: "year",
      and: false,
      exclusive: false,
    }
  };

  return obj;
};

var generateLeadersFilters = () => {
  var obj = {};
  return obj;
};

var loadProjectsGallery = () => {
  var holder = document.createElement("div");
  holder.classList.add("projects-gallery-holder");
  holder.classList.add("gallery-holder");

  var projGallery = DATA.projects.map(p => p);

  projGallery.forEach((p, index) => {
    var card = generateGalleryCardProject(p, index);
    holder.append(card);
  });

  return holder;
};

var loadPlatformsGallery = () => {
  var holder = document.createElement("div");
  holder.classList.add("platforms-gallery-holder");
  holder.classList.add("gallery-holder");

  var platGallery = DATA.platforms.map(p => p);

  var prevYear = 0;
  platGallery.forEach((p, index) => {
    var year = +p.date.substring(0, 4);
    if (year !== prevYear) {
      prevYear = year;
      var yearCard = document.createElement("a");
      yearCard.classList.add("card");
      yearCard.classList.add("separator");
      yearCard.classList.add(`year-${year}`);
      yearCard.innerHTML = year;
      holder.append(yearCard);
    }
    var card = generateGalleryCardPlatform(p, index);
    holder.append(card);
  });

  return holder;
};

var loadDesignersGallery = () => {
  var holder = document.createElement("div");
  holder.classList.add("designers-gallery-holder");
  holder.classList.add("gallery-holder");

  var desGallery = DATA.designers.map(p => p);
  
  var prevYear = 0;
  desGallery.forEach((p, index) => {
    if (p.class !== prevYear) {
      prevYear = p.class;
      var yearCard = document.createElement("a");
      yearCard.classList.add("card");
      yearCard.classList.add("separator");
      yearCard.classList.add(`year-${p.class}`);
      yearCard.innerHTML = p.class;
      holder.append(yearCard);
    }
    var card = generateGalleryCardDesigner(p, index);
    holder.append(card);
  });

  return holder;
};

var loadLeadersGallery = () => {
  var holder = document.createElement("div");
  holder.classList.add("leaders-gallery-holder");
  holder.classList.add("gallery-holder");

  var leadGallery = DATA.leaders.map(p => p);
  
  var active = "";
  leadGallery.forEach((p, index) => {
    if (p.active != active) {
      active = p.active;
      var activeCard = document.createElement("a");
      activeCard.classList.add("card");
      activeCard.classList.add("separator");
      activeCard.innerHTML = p.active;
      holder.append(activeCard);
    }
    var card = generateGalleryCardLeader(p, index);
    holder.append(card);
  });

  return holder;
};

var generateGalleryCardProject = (p, index) => {
  var card = document.createElement("a");
  card.id = `project-${index}`;
  card.classList.add(`project-card`);
  card.classList.add(`card`);

  var year = DATA.platforms[p.platform.index].date.substring(0, 4);
  card.classList.add(`year-${year}`);

  if (p.specialization) {
    var spec = p.specialization.map(s => s.replace(/[ &]/g, ""));
    spec.forEach(s => {
      card.classList.add(`spec-${s}`);
    });
  }

  if (p.tags) {
    var tags = p.tags.map(t => t.replace(/[ &]/g, ""));
    tags.forEach(t => {
      card.classList.add(`tag-${t}`);
    });
  }

  card.addEventListener("click", e => {
    var typeIndex = card.id.split("-");
    loadNewItem(typeIndex[0], +typeIndex[1]);
  });

  var singleProj = document.createElement("div");
  singleProj.classList.add("card-frame");

  var img = document.createElement("div");
  img.classList.add("card-image");
  img.style.backgroundImage = `url("assets/projects/${p.imageNames[0]}")`;

  var plat = document.createElement("h3");
  plat.innerHTML = DATA.platforms[p.platform.index].name;
  
  var name = document.createElement("h2");
  name.innerHTML = p.name;

  var designers = document.createElement("ul");
  p.designers.forEach(d => {
    var list = document.createElement("li");
    list.innerHTML = DATA.designers[d.index].name;
    designers.append(list);
  });
  if (p.collaborators.length > 0) {
    var coll = p.collaborators.split(",");
    coll.forEach(c => {
      var list = document.createElement("li");
      list.innerHTML = c.trim();
      designers.append(list);
    });
  }

  singleProj.append(img, plat, name, designers);
  card.append(singleProj);
  return card;
};

var generateGalleryCardPlatform = (p, index) => {
  var card = document.createElement("a");
  card.id = `platform-${index}`;
  card.classList.add(`platform-card`);
  card.classList.add(`card`);

  var year = p.date.substring(0, 4);
  card.classList.add(`year-${year}`);

  if (p.specialization) {
    var spec = p.specialization.map(s => s.replace(/[ &]/g, ""));
    spec.forEach(s => {
      card.classList.add(`spec-${s}`);
    });
  }

  if (p.tags) {
    var tags = p.tags.map(t => t.replace(/[ &]/g, ""));
    tags.forEach(t => {
      card.classList.add(`tag-${t}`);
    });
  }
  
  if (p.partners) {
    var partners = p.partners.map(pa => pa.replace(/[ &]/g, ""));
    partners.forEach(pa => {
      card.classList.add(`partner-${pa}`);
    });
  }

  card.addEventListener("click", e => {
    var typeIndex = card.id.split("-");
    loadNewItem(typeIndex[0], +typeIndex[1]);
  });

  var singlePlat = document.createElement("div");
  singlePlat.classList.add("card-frame");

  var img = document.createElement("div");
  img.classList.add("card-image");
  
  if (p.thumbnail !== undefined) {
    img.style.backgroundImage = `url("assets/platforms/${p.imageNames[0]}")`;
  } else {
    img.style.backgroundImage = `url("assets/projects/${DATA.projects[p.projects[0].index].imageNames[0]}")`;
  }
  
  var year = document.createElement("h3");
  year.innerHTML = p.date.substring(0, 4);

  var name = document.createElement("h2");
  name.innerHTML = p.name;

  var lead = document.createElement("ul");
  var list = document.createElement("li");
  p.leaders.forEach((d, i, arr) => {
    list.innerHTML += DATA.leaders[d.index].name;
    if (i < arr.length - 1) list.innerHTML += ", ";
  });
  lead.append(list);

  var desc = document.createElement("p");
  
  // if (p.description !== undefined)  {
  //   desc.innerHTML = marked.parse(p.description);
  // }
  
  var tags = document.createElement("ul");
  tags.classList.add("tags");
  if (Array.isArray(p.tags)) {
    p.tags.forEach(t => {
      tags.innerHTML += `<li>${t}</li>`;
    });
  }

  singlePlat.append(img, year, name, lead, tags);
  card.append(singlePlat);

  return card;
};

var generateGalleryCardDesigner = (p, index) => {
  var card = document.createElement("a");
  card.id = `designer-${index}`;
  card.classList.add(`designer-card`);
  card.classList.add(`card`);

  var year = p.class;
  card.classList.add(`year-${year}`);

  card.addEventListener("click", e => {
    var typeIndex = card.id.split("-");
    loadNewItem(typeIndex[0], +typeIndex[1]);
  });

  var singleDes = document.createElement("div");
  singleDes.classList.add("card-frame");

  var img = document.createElement("div");
  img.classList.add("card-image");
  img.style.backgroundImage =
    p.thumbnail === undefined ? `` : `url("assets/designers/${p.imageNames[0]}")`;

  if (p.thumbnail === undefined) {
    img.style.background = `linear-gradient(${Math.floor(Math.random() * 4) *
      90}deg, rgba(190,190,190,1) 0%, rgba(255,242,217,1) 100%)`;
  }

  var year = document.createElement("h3");
  year.innerHTML = p.class;

  var name = document.createElement("h2");
  name.innerHTML = p.name;

  singleDes.append(img, name);
  card.append(singleDes);

  return card;
};

var generateGalleryCardLeader = (p, index) => {
  var card = document.createElement("a");
  card.id = `leader-${index}`;
  card.classList.add(`leader-card`);
  card.classList.add(`card`);

  card.addEventListener("click", e => {
    var typeIndex = card.id.split("-");
    loadNewItem(typeIndex[0], +typeIndex[1]);
  });

  var singleLead = document.createElement("div");
  singleLead.classList.add("card-frame");

  var img = document.createElement("div");
  img.classList.add("card-image");
  img.style.backgroundImage =
    p.thumbnail === undefined ? `` : `url("assets/leaders/${p.imageNames[0]}")`;

  if (p.thumbnail === undefined) {
    img.style.background = `linear-gradient(${Math.floor(Math.random() * 4) *
      90}deg, rgba(190,190,190,1) 0%, rgba(217,237,255,1) 100%)`;
  }

  var name = document.createElement("h2");
  name.innerHTML = p.name;

  singleLead.append(img, name);
  card.append(singleLead);

  return card;
};

//Generates 1 project item (left side)

var generateItemProject = (
  _imgSrcArr,
  _captions,
  _title,
  _platform,
  _designers,
  _collabs,
  _description,
  _video
) => {
  var holder = document.createElement("div");
  holder.classList.add("item-holder");
  holder.classList.add("item-project");

  // var imgDiv = generateImageGallery(_imgSrcArr);

  var heroImageHolder = document.createElement("div");
  heroImageHolder.classList.add("image-gallery-frame");
  var heroImg = document.createElement("img");
  heroImg.classList.add("active");
  heroImg.src = `assets/projects/${_imgSrcArr[0]}`;
  heroImageHolder.append(heroImg);

  var extraImageHolder = document.createElement("div");
  extraImageHolder.classList.add("extra-images-holder");
  _imgSrcArr.forEach((image, i) => {
    if (i > 0) {
      var imgHolder = document.createElement("div");
      imgHolder.classList.add("image-gallery-frame");
      var img = document.createElement("img");
      img.classList.add("active");
      img.src = `assets/projects/${image}`;
      imgHolder.append(img);

      if (i < _captions.length) {
        var para = document.createElement("p");
        para.classList.add("extra-image-caption");
        para.innerHTML = _captions[i];
        imgHolder.append(para);
      }

      extraImageHolder.append(imgHolder);
    }
  })

  var titleDiv = document.createElement("div");
  titleDiv.classList.add("project-title");
  var itemType = document.createElement("p");
  itemType.classList.add("item-type");
  itemType.innerHTML = "Project";
  var title = document.createElement("h1");
  title.innerHTML = _title;
  titleDiv.append(itemType, title);

  var platformDiv = document.createElement("div");
  platformDiv.classList.add("project-platform");
  var platform = document.createElement("h3");
  platform.classList.add("clickable-item");
  
  var platformDate = DATA.platforms[_platform.index].date;
  
  var platformName = `${DATA.platforms[_platform.index].name} (${platformDate.split("-")[0]})`;
  platform.innerHTML = `${platformName}`;
  platform.id = `platform-${_platform.index}`;
  platform.addEventListener("click", e => {
    var typeIndex = platform.id.split("-");
    loadNewItem(typeIndex[0], +typeIndex[1]);
  });
  
  platformDiv.append(platform);

  var designersDiv = document.createElement("div");
  designersDiv.classList.add("project-designers");

  var designersArr = [];

  _designers.forEach(d => {
    var obj = {
      name: DATA.designers[d.index].name,
      rID: d.index
    };
    designersArr.push(obj);
  });

  if (_collabs.length > 0) {
    var collabs = _collabs.split(",").map(c => c.trim());

    collabs.forEach(c => {
      var obj = {
        name: c,
        rID: -1
      };
      designersArr.push(obj);
    });
  }

  var designersList = document.createElement("ul");
  designersArr.forEach(d => {
    var designer = document.createElement("li");
    if (d.rID != -1) {
      var linkedLi = document.createElement("a");
      linkedLi.classList.add("clickable-item");
      linkedLi.innerHTML = d.name;
      // linkedLi.href = "https://www.google.com";
      linkedLi.id = `designer-${d.rID}`;
      linkedLi.addEventListener("click", e => {
        var typeIndex = linkedLi.id.split("-");
        loadNewItem(typeIndex[0], typeIndex[1]);
      });
      designer.append(linkedLi);
    } else {
      designer.innerHTML = d.name;
    }
    designersList.appendChild(designer);
  });

  designersDiv.append(designersList);

  var descriptionDiv = document.createElement("div");
  descriptionDiv.classList.add("project-description");
  var description = document.createElement("p");
  if (_description === undefined) {
    description.innerHTML = "";
  } else {
    description.innerHTML = _description;
  }
  descriptionDiv.append(description);

  var videoDiv = document.createElement("div");
  videoDiv.classList.add("project-video");
  var video = document.createElement("div");
  if (_video.type === "youtube") {
    video.innerHTML = `<iframe width="100%" height="360" src="https://www.youtube.com/embed/${_video.id}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else if (_video.type === "vimeo") {
    video.innerHTML = `<iframe src="https://player.vimeo.com/video/${_video.id}" width="100%" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  } else {
    video.innerHTML = "";
  }

  videoDiv.append(video);

  holder.append(
    heroImageHolder,
    titleDiv,
    platformDiv,
    designersDiv,
    descriptionDiv,
    videoDiv
  );

  if (_imgSrcArr.length > 1) {
    holder.append(extraImageHolder);
  }

  return holder;
};

//Generates image gallery for project item (left side)

// var generateImageGallery = _imgSrcArr => {
//   var gallery = document.createElement("div");
//   gallery.classList.add("image-gallery");

//   var left = document.createElement("div");
//   left.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 31" style="transform:translate(-50%, -50%) scaleX(-1);"><polyline points="0.5 15.5 30.5 15.5 15.5 0.5 30.5 15.5 15.5 30.5" style="fill: none;stroke: white;stroke-linecap:round;stroke-linejoin: round"/></svg>`;
//   left.classList.add("image-gallery-left");

//   var right = document.createElement("div");
//   right.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31 31"><polyline points="0.5 15.5 30.5 15.5 15.5 0.5 30.5 15.5 15.5 30.5" style="fill: none;stroke: white;stroke-linecap:round;stroke-linejoin: round"/></svg>`;
//   right.classList.add("image-gallery-right");

//   if (_imgSrcArr.length == 1) {
//     left.style.display = "none";
//     right.style.display = "none";
//   } else {
//     left.style.display = "block";
//     right.style.display = "block";
//   }

//   var imgDiv = document.createElement("div");
//   imgDiv.classList.add("image-gallery-frame");

//   _imgSrcArr.forEach((src, i, arr) => {
//     var img = document.createElement("img");
//     img.src = src;
//     img.id = `image-${i}_${arr.length}`;
//     if (i === 0) {
//       img.classList.add("active");
//     }
//     imgDiv.append(img);
//   });

//   left.addEventListener("click", e => {
//     var frame = gallery.querySelector(".image-gallery-frame");
//     var imageCount = frame.querySelectorAll("img").length;
//     var currentImg = frame.querySelector(".active");
//     var currentIndex = +currentImg.id.split("-")[1].split("_")[0];
//     var totalNumber = +currentImg.id.split("-")[1].split("_")[1];
//     var newIndex = (totalNumber + currentIndex - 1) % totalNumber;
//     currentImg.classList.remove("active");
//     frame
//       .querySelector(`#image-${newIndex}_${totalNumber}`)
//       .classList.add("active");
//   });

//   right.addEventListener("click", e => {
//     var frame = gallery.querySelector(".image-gallery-frame");
//     var imageCount = frame.querySelectorAll("img").length;
//     var currentImg = frame.querySelector(".active");
//     var currentIndex = +currentImg.id.split("-")[1].split("_")[0];
//     var totalNumber = +currentImg.id.split("-")[1].split("_")[1];
//     var newIndex = (totalNumber + currentIndex + 1) % totalNumber;
//     currentImg.classList.remove("active");
//     frame
//       .querySelector(`#image-${newIndex}_${totalNumber}`)
//       .classList.add("active");
//   });

//   gallery.append(imgDiv, left, right);

//   return gallery;
// };

//Generates 1 designer item (left side)

var generateItemDesigner = (_portrait, _name, _grad, _link, _projects) => {
  var holder = document.createElement("div");
  holder.classList.add("item-holder");
  holder.classList.add("item-designer");

  var portraitDiv = document.createElement("div");
  portraitDiv.classList.add("designer-portrait");
  var portrait = document.createElement("div");
  if (_portrait === undefined) {
    portraitDiv.style.height = "200px";
    portraitDiv.style.width = "200px";
    portraitDiv.style.background = `linear-gradient(${Math.floor(
      Math.random() * 4
    ) * 90}deg, rgba(190,190,190,1) 0%, rgba(255,242,217,1) 100%)`;
  } else {
    var portraitImg = document.createElement("img");
    portraitImg.src = `assets/designers/${_portrait[0]}`;
    portraitDiv.append(portraitImg);
  }
  
  var nameBlock = document.createElement("div");
  nameBlock.classList.add("name-block");

  var nameDiv = document.createElement("div");
  nameDiv.classList.add("designer-name");
  var itemType = document.createElement("p");
  itemType.classList.add("item-type");
  itemType.innerHTML = `Graduating Class of ${_grad}`;
  var name = document.createElement("h1");
  name.innerHTML = _name;
  nameDiv.append(itemType, name);

  var gradDiv = document.createElement("div");
  gradDiv.classList.add("designer-grad");
  var grad = document.createElement("p");
  grad.innerHTML = `Graduating Class of ${_grad}`;
  gradDiv.append(grad);

  var linkDiv = document.createElement("div");
  linkDiv.classList.add("designer-link");
  var link = document.createElement("div");
  if (_link === undefined) {
    link.innerHTML = "";
  } else {
    link.innerHTML = `<a target="_blank" href="${_link}">${_link}</a>`;
  }
  linkDiv.append(link);
  
  nameBlock.append(nameDiv, linkDiv);
  
  var topBlock = document.createElement("div");
  topBlock.classList.add("person-block");
  
  topBlock.append(portraitDiv, nameBlock);

  var projDiv = document.createElement("div");
  projDiv.classList.add("designer-proj");
  projDiv.classList.add("item-card-list");
  
  var projLabel = document.createElement("h3");
  projLabel.innerHTML = "Projects";
  projDiv.append(projLabel);
  _projects.forEach(p => {
    var proj = document.createElement("div");
    proj.id = `project-${p.index}`;

    proj.addEventListener("click", e => {
      var typeIndex = proj.id.split("-");
      loadNewItem(typeIndex[0], typeIndex[1]);
    });

    proj.classList.add("item-proj-card");
    proj.classList.add("item-card");
    var projFrame = document.createElement("div");
    projFrame.classList.add("proj-img");
    projFrame.classList.add("thumbnail");
    projFrame.style.backgroundImage = `url("assets/projects/${DATA.projects[p.index].imageNames[0]}")`;
    var projName = document.createElement("div");
    var pro = DATA.projects[p.index];
    projName.innerHTML = `<span class="project-name">${pro.name}</span><span class="platform-name">${DATA.platforms[pro.platform.index].name}</span>`;
    proj.append(projFrame, projName);
    projDiv.append(proj);
  });

  holder.append(topBlock, projDiv);
  return holder;
};

//Generates 1 platform item (left side)

var generateItemPlatform = (
  _name,
  _date,
  _leaders,
  _collaborators,
  _specialization,
  _tags,
  _description,
  _projects
) => {
  var holder = document.createElement("div");
  holder.classList.add("item-holder");
  holder.classList.add("item-platform");

  var nameDiv = document.createElement("div");
  nameDiv.classList.add("platform-name");
  var itemType = document.createElement("span");
  itemType.classList.add("item-type");
  itemType.innerHTML = "Design Platform";
  var name = document.createElement("h1");
  name.innerHTML = _name;
  nameDiv.append(itemType, name);

  var yearDiv = document.createElement("div");
  yearDiv.classList.add("platform-year");
  var platformYear = document.createElement("p");
  platformYear.innerHTML = _date.split("-")[0];
  yearDiv.append(platformYear);

  var leadersDiv = document.createElement("div");
  leadersDiv.classList.add("platform-leaders");
  _leaders.forEach(l => {
    var leader = document.createElement("span");
    leader.classList.add("clickable-item");
    leader.id = `leader-${l.index}`;
    leader.addEventListener("click", e => {
      var typeIndex = leader.id.split("-");
      loadNewItem(typeIndex[0], typeIndex[1]);
    });
    leader.innerHTML = DATA.leaders[l.index].name;
    leadersDiv.append(leader);
  });

  var collabDiv = document.createElement("div");
  collabDiv.classList.add("platform-collab");
  var collab = document.createElement("p");
  if (_collaborators === undefined) {
    collabDiv.style.display = "none";
  } else {
    collab.innerHTML = `In collaboration with ${_collaborators}`;
  }
  collabDiv.append(collab);
  
  var specTagDiv = document.createElement("div");
  specTagDiv.classList.add("platform-cat");
  
  var specDiv = document.createElement("div");
  specDiv.classList.add("platform-spec");
  if (_specialization != null) {
    _specialization.forEach(s => {
      var spec = document.createElement("div");
      spec.innerHTML = s;
      specDiv.append(spec);
    });
  } else {
    specDiv.style.display = "none";
  }
  
  var tagsDiv = document.createElement("div");
  if (Array.isArray(_tags)) {
    var tagsDiv = document.createElement("div");
    tagsDiv.classList.add("platform-tags");
    _tags.forEach(t => {
      var tag = document.createElement("span");
      tag.innerHTML = t;
      tagsDiv.append(tag);
    });
  }
  
  specTagDiv.append(specDiv, tagsDiv);

  var descrDiv = document.createElement("div");
  descrDiv.classList.add("platform-descr");
  var descr = document.createElement("p");
  descr.innerHTML = _description;
  descrDiv.append(descr);

  var projDiv = document.createElement("div");
  projDiv.classList.add("platform-projs");
  projDiv.classList.add("item-card-list");
  
  var projLabel = document.createElement("h3");
  projLabel.innerHTML = "Projects";
  projDiv.append(projLabel);
  _projects.forEach(p => {
    var proj = document.createElement("div");

    proj.id = `project-${p.index}`;

    proj.addEventListener("click", e => {
      var typeIndex = proj.id.split("-");
      loadNewItem(typeIndex[0], typeIndex[1]);
    });

    proj.classList.add("item-proj-card");
    proj.classList.add("item-card");
    var projFrame = document.createElement("div");
    projFrame.classList.add("proj-img");
    projFrame.classList.add("thumbnail");
    projFrame.style.backgroundImage = `url("assets/projects/${DATA.projects[p.index].imageNames[0]}")`;
    var projName = document.createElement("div");
    var designersString = DATA.projects[p.index].designers
      .map(d => DATA.designers[d.index].name)
      .join(", ");
    if (DATA.projects[p.index].collaborators.length > 0) {
      designersString += `${designersString.length > 0 ? ", " : ""}${
        DATA.projects[p.index].collaborators
      }`;
    }
    projName.innerHTML = `<span class="project-name">${DATA.projects[p.index].name}</span><span class="designers-name">${designersString}</span>`;
    proj.append(projFrame, projName);
    projDiv.append(proj);
  });

  holder.append(
    specTagDiv,
    nameDiv,
    yearDiv,
    leadersDiv,
    collabDiv,
    descrDiv,
    projDiv
  );
  return holder;
};

//Generates 1 leader item (left side)
var generateItemLeader = (
  _portrait,
  _name,
  _position,
  _active,
  _link,
  _email,
  _bio,
  _platforms
) => {
  var holder = document.createElement("div");
  holder.classList.add("item-holder");
  holder.classList.add("item-leader");

  var portraitDiv = document.createElement("div");
  portraitDiv.classList.add("leader-portrait");
  var portrait = document.createElement("img");
  if (_portrait === undefined) {
    portraitDiv.style.height = "200px";
    portraitDiv.style.width = "200px";
    portraitDiv.style.background = `linear-gradient(${Math.floor(
      Math.random() * 4
    ) * 90}deg, rgba(190,190,190,1) 0%, rgba(217,237,255,1) 100%)`;
  } else {
    var portraitImg = document.createElement("img");
    portraitImg.src = `assets/leaders/${_portrait[0]}`;
    portraitDiv.append(portraitImg);
  }
  
  var nameBlock = document.createElement("div");
  nameBlock.classList.add("name-block");

  var nameDiv = document.createElement("div");
  nameDiv.classList.add("leader-name");
  var itemType = document.createElement("p");
  itemType.classList.add("item-type");
  itemType.innerHTML = "Leader";
  var name = document.createElement("h1");
  name.innerHTML = _name;
  nameDiv.append(itemType, name);

  var positionDiv = document.createElement("div");
  positionDiv.classList.add("leader-position");
  positionDiv.innerHTML = _position;

  var activeDiv = document.createElement("div");
  activeDiv.classList.add("leader-active");
  activeDiv.innerHTML = _active;

  var linkDiv = document.createElement("div");
  linkDiv.classList.add("leader-link");
  var link = document.createElement("div");
  if (_link === undefined) {
    link.innerHTML = "";
  } else {
    link.innerHTML = `<a href="${_link}" target="_blank">${_link}</a>`;
  }
  linkDiv.append(link);

  var emailDiv = document.createElement("div");
  emailDiv.classList.add("leader-email");
  var email = document.createElement("div");
  if (_email === undefined) {
    email.innerHTML = "";
  } else {
    email.innerHTML = `<a href="mailto:${_email}">${_email}</a>`;
  }
  emailDiv.append(email);
  
  nameBlock.append(nameDiv, positionDiv, activeDiv, linkDiv, emailDiv);
  
  var topBlock = document.createElement("div");
  topBlock.classList.add("person-block");
  
  topBlock.append(portraitDiv, nameBlock);

  var bioDiv = document.createElement("div");
  bioDiv.classList.add("leader-bio");
  if (_bio === undefined) {
    bioDiv.innerHTML = "";
  } else {
    bioDiv.innerHTML = marked.parse(_bio);
  }

  var platformsDiv = document.createElement("div");
  platformsDiv.classList.add("leader-platforms");
  platformsDiv.classList.add("item-card-list");
  var platformHeader = document.createElement("h3");
  platformHeader.innerHTML = "Platforms";
  platformsDiv.append(platformHeader);

  _platforms.forEach(pla => {
    var platform = document.createElement("div");
    platform.classList.add("item-card");
    platform.id = `platform-${pla.index}`;
    platform.addEventListener("click", e => {
      var typeIndex = platform.id.split("-");
      loadNewItem(typeIndex[0], typeIndex[1]);
    });

    var platFrame = document.createElement("div");
    platFrame.classList.add("plat-img");
    platFrame.classList.add("thumbnail");
    
    if (DATA.platforms[pla.index].thumbnail !== undefined) {
      platFrame.style.backgroundImage = `url("assets/platforms/${DATA.platforms[pla.index].imageNames[0]}")`;
    } else {
      platFrame.style.backgroundImage = `url("assets/projects/${DATA.projects[DATA.platforms[pla.index].projects[0].index].imageNames[0]}")`;
    }
    
    var platName = document.createElement("div");
    platName.innerHTML = `<span class="year">${DATA.platforms[
      pla.index
    ].date.substring(0, 4)}</span><span class="platform-name">${
      DATA.platforms[pla.index].name
    }</span>`;
    
    var platTags = document.createElement("div");
    platTags.classList.add("tags");
    if (Array.isArray(DATA.platforms[pla.index].tags)) {
      DATA.platforms[pla.index].tags.forEach((t, i, arr) => {
        platTags.innerHTML += `<span>${t}</span>`;
      });
    }
    
    platName.append(platTags)

    platform.append(platFrame, platName);

    platformsDiv.append(platform);
  });

  holder.append(topBlock, bioDiv, platformsDiv);
  return holder;
};
