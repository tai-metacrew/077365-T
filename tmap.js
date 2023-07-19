function initTmap() {
  // 1. 지도 띄우기
  map = new Tmapv3.Map("map_div", {
    center: new Tmapv3.LatLng(37.566777390186154, 127.00245938918971),
    width: "100vw",
    height: "100vh",
  });
  map.setZoom(14);

  // 2. 시작, 도착 심볼찍기
  // 시작
  addMarker("llStart", 126.98605733268329, 37.568085523663385, 1);
  // 도착
  addMarker("llEnd", 127.00973587385866, 37.56445848334345, 2);
  function addMarker(status, lon, lat, tag) {
    //출도착경유구분
    //이미지 파일 변경.
    var markerLayer;
    switch (status) {
      case "llStart":
        imgURL =
          "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
        break;
      case "llPass":
        imgURL =
          "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_p.png";
        break;
      case "llEnd":
        imgURL =
          "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
        break;
      default:
    }
    var marker = new Tmapv3.Marker({
      position: new Tmapv3.LatLng(lat, lon),
      icon: imgURL,
      map: map,
    });
    // 마커 드래그 설정
    marker.tag = tag;
    marker.addListener("dragend", function (evt) {
      markerListenerEvent(evt);
    });

    var markerList = [];
    marker.addListener("drag", function (evt) {
      markerObject = markerList[tag];
    });
    markerList[tag] = marker;
    return marker;
  }

  // 3. 경유지 심볼 찍기
  addMarker("llPass", 126.99749158970432, 37.56652289898868, 3);
  addMarker("llPass", 126.99823724381592, 37.56450100535406, 4);
  addMarker("llPass", 127.00186090818215, 37.570721714117965, 5);
  addMarker("llPass", 127.00221495976581, 37.56568310756034, 6);

  // 4. 경유지 최적화 API 사용요청
  var prtcl;
  var headers = {};
  headers["appKey"] = "ITNGzaPq7Q3Ehn1JZ0ecv2zmYJd6y5Z75tDBSOCV";
  $.ajax({
    type: "POST",
    headers: headers,
    url: "https://apis.openapi.sk.com/tmap/routes/routeOptimization30?version=1&format=json", //
    async: false,
    contentType: "application/json",
    data: JSON.stringify({
      reqCoordType: "WGS84GEO",
      resCoordType: "WGS84GEO",
      startName: "출발",
      startX: "126.98605733268329",
      startY: "37.568085523663385",
      startTime: "201711121314",
      endName: "도착",
      endX: "127.00973587385866",
      endY: "37.56445848334345",
      searchOption: "0",
      viaPoints: [
        {
          viaPointId: "test01",
          viaPointName: "test01",
          viaX: "126.99749158970432",
          viaY: "37.56652289898868",
          viaTime: 600,
        },
        {
          viaPointId: "test02",
          viaPointName: "test02",
          viaX: "126.99823724381592",
          viaY: "37.56450100535406",
          viaTime: 600,
        },
        {
          viaPointId: "test03",
          viaPointName: "test03",
          viaX: "127.00186090818215",
          viaY: "37.570721714117965",
          viaTime: 600,
        },
        {
          viaPointId: "test04",
          viaPointName: "test04",
          viaX: "127.00221495976581",
          viaY: "37.56568310756034",
          viaTime: 600,
        },
      ],
    }),
    success: function (response) {
      prtcl = response;
      // 5. 경유지 최적화 결과 Line 그리기
      //경유지 최적화 결과 POINT 찍기
      /* -------------- Geometry.Point -------------- */

      /* -------------- Geometry.Point -------------- */
      //경유지 최적화 결과 Line 그리기
      drawData(prtcl);

      // 6. 경유지 최적화 결과 반경만큼 지도 레벨 조정
      map.zoomToExtent(routeLayer.getDataExtent());
    },
    error: function (request, status, error) {
      console.log(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );

      mockLines = {
        type: "FeatureCollection",
        properties: {
          totalDistance: "6333",
          totalTime: "1722",
          totalFare: "0",
        },
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [126.9860564, 37.56808471],
            },
            properties: {
              index: "0",
              viaPointId: "",
              viaPointName: "[0] 출발",
              arriveTime: "20171112131400",
              completeTime: "20171112131400",
              distance: "0",
              deliveryTime: "0",
              waitTime: "0",
              pointType: "S",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [126.99749151, 37.56652398],
            },
            properties: {
              index: "1",
              viaPointId: "test01",
              viaPointName: "[0] test01",
              viaDetailAddress: "",
              groupKey: "0",
              arriveTime: "20171112131908",
              completeTime: "20171112132908",
              distance: "1202",
              deliveryTime: "600",
              waitTime: "0",
              pointType: "B1",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [126.98606473, 37.56813192],
                [126.98636471, 37.56807082],
                [126.98645081, 37.56805138],
                [126.98689799, 37.56799029],
                [126.98730629, 37.56797085],
                [126.98737017, 37.5679403],
                [126.9874035, 37.56791808],
                [126.9874285, 37.56789031],
                [126.9874535, 37.5678542],
                [126.98749794, 37.56777366],
                [126.98745075, 37.56680432],
                [126.98742854, 37.56640715],
                [126.98742855, 37.56625161],
                [126.98762576, 37.56615718],
                [126.98842291, 37.56617108],
                [126.98921728, 37.56619887],
                [126.98973667, 37.56621554],
                [126.9908699, 37.56627945],
                [126.99141707, 37.56630723],
                [126.99199202, 37.56633502],
                [126.99260585, 37.56637113],
                [126.99339189, 37.56641003],
                [126.99352799, 37.56641559],
                [126.99443346, 37.56645449],
                [126.99499174, 37.56648227],
                [126.99530838, 37.56649895],
                [126.99532227, 37.56650172],
                [126.99543892, 37.5665045],
                [126.99551947, 37.56651006],
                [126.9957139, 37.56651839],
                [126.99573334, 37.56651839],
                [126.99604998, 37.56653784],
                [126.99607775, 37.56653784],
                [126.99639161, 37.56656007],
                [126.99650271, 37.56656563],
                [126.99669158, 37.56657674],
                [126.99740541, 37.56660175],
                [126.99748873, 37.56660175],
              ],
            },
            properties: {
              index: "1",
              viaPointId: "test01",
              viaPointName: "[0] test01",
              viaDetailAddress: "",
              groupKey: "0",
              arriveTime: "20171112131908",
              completeTime: "20171112132908",
              distance: "1202",
              time: "308",
              deliveryTime: "600",
              waitTime: "0",
              Fare: "0",
              poiId: "",
              pointType: "B1",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [126.99823595, 37.56450201],
            },
            properties: {
              index: "2",
              viaPointId: "test02",
              viaPointName: "[0] test02",
              viaDetailAddress: "",
              groupKey: "0",
              arriveTime: "20171112132954",
              completeTime: "20171112133954",
              distance: "294",
              deliveryTime: "600",
              waitTime: "0",
              pointType: "B2",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [126.99748873, 37.56660175],
                [126.99749151, 37.56660453],
                [126.99788036, 37.56662675],
                [126.99802202, 37.56663787],
                [126.99804979, 37.56663787],
                [126.99811368, 37.56664342],
                [126.99816091, 37.56601572],
                [126.99817202, 37.56589907],
                [126.99818592, 37.56575742],
                [126.99823871, 37.56512416],
                [126.9982915, 37.56450479],
              ],
            },
            properties: {
              index: "2",
              viaPointId: "test02",
              viaPointName: "[0] test02",
              viaDetailAddress: "",
              groupKey: "0",
              arriveTime: "20171112132954",
              completeTime: "20171112133954",
              distance: "294",
              time: "46",
              deliveryTime: "600",
              waitTime: "0",
              Fare: "0",
              poiId: "",
              pointType: "B2",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [127.00221333, 37.5656825],
            },
            properties: {
              index: "3",
              viaPointId: "test04",
              viaPointName: "[0] test04",
              viaDetailAddress: "",
              groupKey: "0",
              arriveTime: "20171112134356",
              completeTime: "20171112135356",
              distance: "1107",
              deliveryTime: "600",
              waitTime: "0",
              pointType: "B3",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [126.9982915, 37.56450479],
                [126.99830539, 37.5643548],
                [126.9982665, 37.5643548],
                [126.99788043, 37.56432702],
                [126.99760545, 37.56431035],
                [126.99718605, 37.5642909],
                [126.9970444, 37.56428257],
                [126.99666943, 37.56426312],
                [126.99618059, 37.56424089],
                [126.99614169, 37.56475194],
                [126.99614169, 37.56477416],
                [126.99615002, 37.56479916],
                [126.99615835, 37.5648186],
                [126.99622501, 37.56490192],
                [126.99657774, 37.56536854],
                [126.99658329, 37.56538799],
                [126.99658885, 37.56541021],
                [126.99658885, 37.5654352],
                [126.99658051, 37.56556574],
                [126.99658051, 37.56559074],
                [126.99657773, 37.56565462],
                [126.9965694, 37.56573239],
                [126.99650271, 37.56656563],
                [126.99669158, 37.56657674],
                [126.99740541, 37.56660175],
                [126.99749151, 37.56660453],
                [126.99788036, 37.56662675],
                [126.99802202, 37.56663787],
                [126.99804979, 37.56663787],
                [126.99811368, 37.56664342],
                [126.99880528, 37.56667954],
                [126.99901915, 37.56669066],
                [126.99914136, 37.56669899],
                [126.99930801, 37.5667101],
                [127.00011349, 37.56675733],
                [127.0002107, 37.56676289],
                [127.00022459, 37.56676289],
                [127.0002607, 37.56676567],
                [127.00033569, 37.56677123],
                [127.00044124, 37.56677678],
                [127.00059956, 37.56678512],
                [127.00096063, 37.56680179],
                [127.00099396, 37.56680179],
                [127.00134949, 37.56682124],
                [127.00146336, 37.5668268],
                [127.00176056, 37.56684347],
                [127.00218274, 37.56684903],
                [127.00224663, 37.56685181],
                [127.00227719, 37.56647963],
                [127.00229386, 37.56627132],
                [127.00231053, 37.56606579],
                [127.00233832, 37.56569083],
              ],
            },
            properties: {
              index: "3",
              viaPointId: "test04",
              viaPointName: "[0] test04",
              viaDetailAddress: "",
              groupKey: "0",
              arriveTime: "20171112134356",
              completeTime: "20171112135356",
              distance: "1107",
              time: "242",
              deliveryTime: "600",
              waitTime: "0",
              Fare: "0",
              poiId: "",
              pointType: "B3",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [127.00186044, 37.57072357],
            },
            properties: {
              index: "4",
              viaPointId: "test03",
              viaPointName: "[0] test03",
              viaDetailAddress: "",
              groupKey: "0",
              arriveTime: "20171112140542",
              completeTime: "20171112141542",
              distance: "2240",
              deliveryTime: "600",
              waitTime: "0",
              pointType: "B4",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [127.00233832, 37.56569083],
                [127.00234387, 37.56561862],
                [127.00235221, 37.56552418],
                [127.00241612, 37.56461596],
                [127.00246057, 37.56414101],
                [127.00246613, 37.56407713],
                [127.00256615, 37.56319113],
                [127.0026217, 37.56320501],
                [127.00264392, 37.56321057],
                [127.00362715, 37.56343278],
                [127.00366882, 37.56344112],
                [127.00389102, 37.56349112],
                [127.00456595, 37.56364667],
                [127.0046715, 37.56367166],
                [127.00495758, 37.56373555],
                [127.00543809, 37.56383833],
                [127.00564362, 37.56388555],
                [127.00572139, 37.56390499],
                [127.00587971, 37.5639411],
                [127.00597137, 37.56396054],
                [127.00650187, 37.56407443],
                [127.00660464, 37.56409109],
                [127.00715181, 37.56417998],
                [127.00724346, 37.56449661],
                [127.00729623, 37.56467437],
                [127.00734344, 37.56479658],
                [127.00737122, 37.56487157],
                [127.00739621, 37.56494101],
                [127.00750731, 37.5651521],
                [127.00773227, 37.56557705],
                [127.00783781, 37.56582703],
                [127.00785725, 37.56587147],
                [127.00790447, 37.56598256],
                [127.00797112, 37.56617143],
                [127.00807111, 37.5664464],
                [127.00811277, 37.56654917],
                [127.00826552, 37.56678803],
                [127.00883489, 37.56756295],
                [127.00886267, 37.56760184],
                [127.0092154, 37.56809068],
                [127.00924595, 37.56812956],
                [127.00926262, 37.56815178],
                [127.00951814, 37.56849064],
                [127.00966812, 37.56870172],
                [127.00977644, 37.56888504],
                [127.00981532, 37.5689767],
                [127.00984309, 37.56905446],
                [127.0098653, 37.56952108],
                [127.00986252, 37.56953774],
                [127.00986252, 37.56962384],
                [127.00985419, 37.56969328],
                [127.00984307, 37.5698627],
                [127.00983751, 37.56989603],
                [127.00983196, 37.56993492],
                [127.00982362, 37.56999324],
                [127.00980696, 37.57007934],
                [127.00979585, 37.57013489],
                [127.00977084, 37.57023488],
                [127.00970973, 37.57039875],
                [127.00964029, 37.57054873],
                [127.00954863, 37.57072371],
                [127.00945697, 37.57086814],
                [127.00942919, 37.57091535],
                [127.00935697, 37.57102923],
                [127.00925975, 37.5711681],
                [127.00919031, 37.57126531],
                [127.00894589, 37.57134029],
                [127.00880146, 37.57130141],
                [127.00860148, 37.57124308],
                [127.00853204, 37.57122086],
                [127.00849038, 37.57121252],
                [127.00844594, 37.57120419],
                [127.00840427, 37.57120419],
                [127.00780988, 37.57119585],
                [127.00735159, 37.57119028],
                [127.0068933, 37.57118472],
                [127.00668777, 37.57118194],
                [127.00648501, 37.57118471],
                [127.00635168, 37.57118471],
                [127.0056823, 37.5711597],
                [127.00535178, 37.57115136],
                [127.00493515, 37.57114025],
                [127.00481571, 37.57113747],
                [127.00387136, 37.57110967],
                [127.00375192, 37.57110967],
                [127.00329641, 37.57110689],
                [127.00311865, 37.57110411],
                [127.00249648, 37.57108465],
                [127.00235205, 37.57108187],
                [127.00194376, 37.57107353],
                [127.00182988, 37.57092355],
                [127.00184655, 37.57072079],
              ],
            },
            properties: {
              index: "4",
              viaPointId: "test03",
              viaPointName: "[0] test03",
              viaDetailAddress: "",
              groupKey: "0",
              arriveTime: "20171112140542",
              completeTime: "20171112141542",
              distance: "2240",
              time: "706",
              deliveryTime: "600",
              waitTime: "0",
              Fare: "0",
              poiId: "",
              pointType: "B4",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [127.0097349, 37.56445777],
            },
            properties: {
              index: "5",
              viaPointId: "",
              viaPointName: "[0] 도착",
              arriveTime: "20171112142242",
              completeTime: "20171112142242",
              distance: "1490",
              deliveryTime: "0",
              waitTime: "0",
              pointType: "E",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [127.00184655, 37.57072079],
                [127.00189656, 37.57014864],
                [127.00192991, 37.56977368],
                [127.00193546, 37.56972091],
                [127.00195213, 37.56952927],
                [127.00195491, 37.56950427],
                [127.00195491, 37.56947372],
                [127.00197158, 37.56931263],
                [127.00204382, 37.5685405],
                [127.00205493, 37.56840996],
                [127.0020855, 37.56806555],
                [127.00211328, 37.56774614],
                [127.00211884, 37.56766282],
                [127.00222162, 37.56728231],
                [127.00222717, 37.56719621],
                [127.00224663, 37.56685181],
                [127.00227719, 37.56647963],
                [127.00229386, 37.56627132],
                [127.00231053, 37.56606579],
                [127.00234387, 37.56561862],
                [127.00235221, 37.56552418],
                [127.00241612, 37.56461596],
                [127.00246057, 37.56414101],
                [127.00246613, 37.56407713],
                [127.00256615, 37.56319113],
                [127.0026217, 37.56320501],
                [127.00264392, 37.56321057],
                [127.00362715, 37.56343278],
                [127.00366882, 37.56344112],
                [127.00389102, 37.56349112],
                [127.00456595, 37.56364667],
                [127.0046715, 37.56367166],
                [127.00495758, 37.56373555],
                [127.00543809, 37.56383833],
                [127.00564362, 37.56388555],
                [127.00572139, 37.56390499],
                [127.00587971, 37.5639411],
                [127.00597137, 37.56396054],
                [127.00650187, 37.56407443],
                [127.00660464, 37.56409109],
                [127.00715181, 37.56417998],
                [127.00748233, 37.56423276],
                [127.00844613, 37.56437165],
                [127.00852112, 37.56438554],
                [127.00869611, 37.56441332],
                [127.0089322, 37.56444943],
                [127.00923772, 37.56449943],
                [127.00931549, 37.56451054],
                [127.00971545, 37.56457165],
              ],
            },
            properties: {
              index: "5",
              viaPointId: "",
              viaPointName: "[0] 도착",
              arriveTime: "20171112142242",
              completeTime: "20171112142242",
              distance: "1490",
              time: "420",
              deliveryTime: "0",
              waitTime: "0",
              Fare: "0",
              poiId: "",
              pointType: "E",
            },
          },
        ],
      };

      /* -------------- Geometry.Point -------------- */
      //경유지 최적화 결과 Line 그리기
      map.on("ConfigLoad", function () {
        drawData(mockLines);

        // 6. 경로탐색 결과 반경만큼 지도 레벨 조정
        var newData = geoData[0];
        PTbounds = new Tmapv3.LatLngBounds();
        for (var i = 0; i < newData.length; i++) {
          var mData = newData[i];
          var type = mData.geometry.type;
          var pointType = mData.properties.pointType;
          if (type == "Point") {
            var linePt = new Tmapv3.LatLng(
              mData.geometry.coordinates[1],
              mData.geometry.coordinates[0]
            );
            PTbounds.extend(linePt);
          } else {
            var startPt, endPt;
            for (var j = 0; j < mData.geometry.coordinates.length; j++) {
              var linePt = new Tmapv3.LatLng(
                mData.geometry.coordinates[j][1],
                mData.geometry.coordinates[j][0]
              );
              PTbounds.extend(linePt);
            }
          }
        }
        map.fitBounds(PTbounds);
      });
    },
  });

  function drawData(data) {
    // 지도위에 선은 다 지우기
    routeData = data;
    var resultStr = "";
    var distance = 0;
    var idx = 1;
    var newData = [];
    var equalData = [];
    var pointId1 = "-1234567";
    var ar_line = [];

    for (var i = 0; i < data.features.length; i++) {
      var feature = data.features[i];
      //배열에 경로 좌표 저잘
      new_polyLine = [];
      if (feature.geometry.type == "LineString") {
        ar_line = [];
        pointArray = [];
        for (var j = 0; j < feature.geometry.coordinates.length; j++) {
          var startPt = new Tmapv3.LatLng(
            feature.geometry.coordinates[j][1],
            feature.geometry.coordinates[j][0]
          );
          ar_line.push(startPt);
          pointArray.push(feature.geometry.coordinates[j]);
        }
        var polyline = new Tmapv3.Polyline({
          path: ar_line,
          strokeColor: "#ff0000",
          strokeWeight: 6,
          map: map,
        });
        new_polyLine.push(polyline);
      }
      var pointId2 = feature.properties.viaPointId;
      if (pointId1 != pointId2) {
        equalData = [];
        equalData.push(feature);
        newData.push(equalData);
        pointId1 = pointId2;
      } else {
        equalData.push(feature);
      }
    }
    geoData = newData;
    var markerCnt = 1;
    for (var i = 0; i < newData.length; i++) {
      var mData = newData[i];
      var type = mData[0].geometry.type;
      var pointType = mData[0].properties.pointType;
      var pointTypeCheck = false; // 경유지 일때만 true
      if (mData[0].properties.pointType == "S") {
        var img =
          "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
        var lon = mData[0].geometry.coordinates[0];
        var lat = mData[0].geometry.coordinates[1];
      } else if (mData[0].properties.pointType == "E") {
        var img =
          "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
        var lon = mData[0].geometry.coordinates[0];
        var lat = mData[0].geometry.coordinates[1];
      } else {
        console.log("hello");
        markerCnt = i;
        var lon = mData[0].geometry.coordinates[0];
        var lat = mData[0].geometry.coordinates[1];
      }
    }
  }
}
