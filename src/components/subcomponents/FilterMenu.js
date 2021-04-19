import * as React from "react";
import { Grid, Box, Typography } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import Popper from "@material-ui/core/Popper";
import CloseIcon from "@material-ui/icons/Close";
import MapLayerContent from "./MapLayerContent";
import Divider from "@material-ui/core/Divider";

const FilterMenu = ({
  anchorEl,
  filterMenuOpen,
  setFilterMenuOpen,
  cat,
  setSelectedMenu,
  layerID,
}) => {
  const [menuTileColor, setMenuTileColor] = useState(false);
  const clickRefMenu = useRef(null);
  //click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        clickRefMenu.current &&
        !clickRefMenu.current.contains(event.target)
      ) {
        setFilterMenuOpen(false);
        setSelectedMenu(null);
        console.log("clicked outside");
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setFilterMenuOpen, setSelectedMenu]);
  return (
    <Popper
      id={cat + "filterMenu"}
      ref={clickRefMenu}
      key={cat + "filterMenu"}
      anchorEl={anchorEl}
      placement={
        cat === "health"
          ? "left-end"
          : cat === "socioeconomic"
          ? "left"
          : "left-start"
      }
      style={{
        height: "auto",
        maxHeight: "500px",
        width: "285px",
        zIndex: "1300",
        backgroundColor: "#fff",
      }}
      open={filterMenuOpen}
      onClose={(e) => {
        e.preventDefault();
        setFilterMenuOpen(false);
        setMenuTileColor(false);
        console.log(menuTileColor);
      }}
    >
      <Grid container justify="flex-end" pt={2} key={cat + "filterMenuHeader"}>
        <CloseIcon
          key={cat + "filterMenuClose"}
          fontSize="small"
          color="disabled"
          onClick={(e) => {
            setFilterMenuOpen(false);
          }}
        />
      </Grid>
      <Typography gutterBottom align="center" variant="button" display="block">
        {cat} VARIABLES
      </Typography>
      <Divider />
      <Box
        style={{
          maxHeight: "450px",
          overflow: "auto",
        }}
      >
        <MapLayerContent cat={cat} layerID={layerID} />
      </Box>
    </Popper>
  );
};
export default FilterMenu;
