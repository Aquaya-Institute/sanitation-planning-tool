import { useState, useEffect, useContext, useRef } from "react";
import { MapContext } from "../state/MapState";
import Carto from "@carto/carto.js";
import L, { map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Box, Typography, Link, Grid } from "@material-ui/core";
import Popover from '@material-ui/core/Popover';
import Popper from '@material-ui/core/Popper';
import { makeStyles, ThemeProvider } from '@material-ui/core/styles';
import $ from 'jquery';
import "../App.css";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { positions } from '@material-ui/system';
import theme from '../theme/theme'

const useStyles = makeStyles((theme) => ({
  paper: {
    border: '1px solid',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  legend: {
    // position: 'absolute',
    // bottom: '12px',
    // left: '50px',
    // height: 'auto',
    // width: 'auto',
    // // padding: '20px' '14px',
    // background: 'white',
    // // box-shadow: 0 0 16px rgba(0, 0, 0, 0.12);
    // // border-radius: '4px',
    // opacity: 0.9,
  },
  table: {
    width: '20px',
    height: '20px',
    opacity: 1,
    position: 'absolute',
    bottom: '12px',
    left: '50px',
    // marginbottom: '6px',
  },
}));

function transformArray(array) {
  var obj,
      i,
      key, value;
  var returnedTarget={}
  for (i = 0; i < array.length; i ++) {
    obj = {}
    key = array[i][0];
    value = array[i][1];
    obj[key] = value;
    returnedTarget = Object.assign(returnedTarget, obj);
  }
  return returnedTarget;
}

var gotocountry = function(){
   map.setView(new L.LatLng(34.5333, 69.1333), 6);
  return;
  
  
};

export const Map = () => {
  const [{ currentMapID, maps }, dispatch] = useContext(MapContext);
  const [mapID, setMapID] = useState();
  const [layerID, setlayerID] = useState();
  const [currentMapState, setCurrentMapState] = useState();
  const [leaflet, setLeaflet] = useState();
  const [cartoClient, setCartoClient] = useState();
  const [popup, setPopup] = useState();
  const [anchorEl, setAnchorEl] = useState(null);
  const openPopper = Boolean(popup);
  const openPopover = Boolean(anchorEl);
  const idPopper = openPopper ? 'simple-popover' : undefined;
  const idPopover = openPopover ? 'transitions-popper' : undefined;
  const arrowRef = useRef()
  const classes = useStyles();
  const clickRef = useRef(null);
  const legend = $("#legend-content");
  const legend_title = $("#legend-title");
  const buckets = []

  useEffect(() => {
    const handleClickOutside = event => {
      if (clickRef.current && !clickRef.current.contains(event.target)) {
        setPopup(null);
        console.log("clicked outside")
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    console.log("currentMapID", currentMapID);
    if (currentMapID) {
      setMapID(currentMapID);
    }
  }, [currentMapID]);

  useEffect(()=>{
    //clean up
    if(mapID) {
      return function cleanup() {
        dispatch({
          type: "map.select",
          mapID: null
        });
        dispatch({
          type: "layer.removeCartoLayers",
        });
      };
    }
  }, [mapID])

  useEffect(() => {
    console.log("load");

    if (leaflet !== undefined) {
      //https://github.com/Leaflet/Leaflet/issues/3962#issuecomment-568678650
      console.log("remove map renderer");
      leaflet.remove();
    }

    const client = new Carto.Client({
      apiKey: process.env.REACT_APP_CARTO_DEV_API_KEY,
      username: process.env.REACT_APP_CARTO_USERNAME,
    });

    const map = L.map("map").setView(
      // maps[mapID].view ?? "[8.059229627200192, -1.0546875000000002], 7"
      [8.059229627200192, -1.0546875000000002], 7
    );
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png",
      {
        maxZoom: 22,
      }
    ).addTo(map);

    setLeaflet((prevmap) => {
      if (!prevmap) {
        return map;
      } else {
        return prevmap;
      }
    });

    setCartoClient(client);
    client.getLeafletLayer().addTo(map);
    dispatch({
      type: "map.addCartoClient",
      carto_client: client,
    });
  }, []);

  /* 
  check if map state should be updated, such as on
  selection of a different country from the map selector 
  dropdown.
  Remove any previous layers from cartoClient
  */
  useEffect(() => {
    if (mapID) {
      setCurrentMapState((prevMap) => {
        if (prevMap && prevMap.name === maps[mapID].name) {
          return prevMap;
        } else {
          //user has selected different country
          return maps[mapID];
        }
      });
    }
  }, [maps, mapID, cartoClient]);


  /* 
  When map state is updated run this effect.
  Instantiate carto layers using map state and store 
  the carto layer objects in global state (mapstate.js) so that we 
  can later run operations on the layers - such as 
  filtering, toggling visibility 
  */
  useEffect(() => {
    console.log("Selected Map Changed", currentMapState);

    if (cartoClient && currentMapState) {
      console.log("Creating Carto Layers");
      const _mapID = currentMapState.mapID;
      // map.setView(new L.LatLng(34.5333, 69.1333),7);
      // gotocountry()

      currentMapState.layers.forEach((layer, index) => {
        const _source = new Carto.source.SQL(
          `SELECT * FROM ${layer.carto_tableName}`
        );
        const _style = new Carto.style.CartoCSS(layer.carto_style);
        const _filters = [];
        const _columns = [];
        layer.filters.forEach((filter, filter_c) => {
          switch (filter.type) {
            case "range":
              const _filter = new Carto.filter.Range(filter.column_name, {
                gte: filter.value[0],
                lte: filter.value[1],
              });
              _filters.push(_filter);
              _columns.push(filter.column_name);
              break;
            case "categorical":
              // const _filter_c = new Carto.filter.Category(filter_c.column_name, {
              //   in: filter_c.column_values
              // });
              // _filters.push(_filter_c);
              // _columns.push(filter_c.column_name);
              break;
            default:
              break;
          }
        });

        //add filters to the source, if any
        if (_filters.length > 0) {
          _source.addFilter(new Carto.filter.AND(_filters));
        }

        //show hide layers based on initial state in config
        const _layer = new Carto.layer.Layer(_source, _style, {
          featureClickColumns: _columns,
        });
        

        //setup feature clicks on relevant layers
        if (_columns.length > 0) {
          _layer.on("featureClicked", (featureEvent) => {
            console.log("clicked a feature", featureEvent);
            setPopup(featureEvent);
          }); 
          
        }
        

        //set default visibility as set in map state
        if (layer.visible) {
          _layer.show();
        } else {
          _layer.hide();
        }

        //add the layer to carto client
        cartoClient.addLayer(_layer);
        setlayerID(index);

        const mins = [], maxs = [], colors = [];
        
        // change legend when data classification method changes
        if (layer.visible){
          _layer.on('metadataChanged', function(event){

            colors.length = 0;
            maxs.length = 0;
            mins.length = 0;
            legend.empty();
            legend_title.empty();
            console.log(event);

            // get buckets
            buckets.push(event.styles[0]._buckets);
            legend_title.append(`<Typography><strong>${layer.name}</strong></Typography>`)
            // populate mins, maxs and colors array
            for (let i=0; i < buckets[0].length; i++) {
              mins.push(buckets[0][i].min.toFixed(2));
              maxs.push(buckets[0][i].max.toFixed(2));
              colors.push(buckets[0][i].value);
            }
            
            // append colors and ranges to the legend
            $(colors).each(function(i, e) {
              legend.append(`
              <TableContainer component={Paper}>
                <Table className={classes.table}>
                  <TableRow>
                    <TableCell ><Paper variant="outlined" square style="background-color: ${colors[i]}"/>...</TableCell>
                    <TableCell>${mins[i]} - ${maxs[i]}</TableCell>
                  </TableRow>
                </Table>
              </TableContainer>
              `)
            });
          
          });
        }
        //add the carto layer to global state
        dispatch({
          type: "layer.addCartoLayer",
          mapID: _mapID,
          layerID: index,
          cartoLayer: _layer,
          // legend: legend
        });

        // add legend elements
        
      });
    }
  }, [currentMapState, cartoClient, dispatch]);

  if (popup){
    var dat=[];
    maps[mapID].layers[layerID].filters.forEach(function (element) {
      dat.push([element.column_name, element.name]);
    });
    dat.sort()
    var dat_loc=[];
    Object.entries(popup.data).slice(1).map((keyName, i) => {
      return dat_loc.push([keyName[0],keyName[1]])
    });
    dat_loc.sort()
    var dat_popup=[];
    for (let i=0; i < dat.length; i++) {
      for (let j = 0; j < dat_loc.length; j++) {
        if (dat[i][0]===dat_loc[j][0]){
          dat_popup.push([dat[i][1],dat_loc[j][1]])
        }
      }
    }
    dat_popup=transformArray(dat_popup);
  }
  
  return (
    <div>
      
      <div id="map" style={{ height: "91vh"}} className={classes.content}>
      
      {popup && popup.data && (
          <Popper ref={clickRef}
            id={idPopper} open={openPopper}
            // placement="left-end"
            disablePortal={true}
            // anchorEl={popup}
            modifiers={{
              flip: {
                enabled: true,
              },
              preventOverflow: {
                enabled: true,
                boundariesElement: 'scrollParent',
              },
              arrow: {
                enabled: true,
                // element: arrowRef,
              },
            }}
            style={{
              position: "absolute",
              left: popup.position.x,
              top: popup.position.y,
              zIndex: "2000",
              backgroundColor: "#fff",
              width: "200px",
            }}
          >
            {/* <Link
              href=""
              onClick={(e) => {
                e.preventDefault();
                setPopup(null);
              }}
            >
              Close
            </Link> */}
            <div className={classes.paper}>
              
              <span><strong>Population Estimate:</strong> {dat_popup['Population Estimate']}</span><br></br>
              <span><strong>Community Classification:</strong> {dat_popup['Community Classification']}</span><br></br>
              <Link 
                component="button"
                onClick={(e) => {
                  e.preventDefault();
                  setAnchorEl(e.currentTarget);
                  // setPopup(null);
                }}
              >
                SEE MORE
              </Link>
            </div>
          
          <Popover ref={clickRef}
            id={idPopover}
            open={openPopover}
            anchorEl={idPopper}
            onClose={() => {
              setAnchorEl(null);
              setPopup(null);}}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
          >
            <table>
              <thead>
                  <tr>
                    <th>Factor</th>
                    <th>Value</th>
                  </tr>
              </thead>
              <tbody>
                {Object.entries(dat_popup).map((keyName, i) => (
                  <tr key={i}>
                    <td>{keyName[0]}:</td>
                    <td><font color='#0067B9'>{keyName[1]}</font></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <center><Link 
              component="button"
              onClick={(e) => {
              }}
            >
              DOWNLOAD TABLE
            </Link></center>
          </Popover>
        </Popper>
      )}
      {/* <Popper 
      open={true}
      elevation={3}
      // anchorEl={anchorEl}
      style={{
        position: 'absolute',
        bottom: '10px', right: '10px', top: 'unset', left: 'unset',
        height: 'auto',
        width: 'auto',
        zIndex: "1000",
        backgroundColor: "#fff",
        padding: "5px",
      }} */}
      <Paper style={{padding: theme.spacing(1),
        position: 'absolute',
        bottom: '10px', right: '10px', top: 'unset', left: 'unset',
        height: 'auto',
        width: 'auto',
        zIndex: "1000",
        backgroundColor: "#fff",}}>
        <div id="legend-title"></div>
        <div className={classes.legend}>
          <div id="legend-content"></div>
        </div></Paper>
      {/* </Popper> */}
      </div>
    </div>
  );
};
