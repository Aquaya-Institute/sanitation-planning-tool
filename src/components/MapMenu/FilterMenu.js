import * as React from "react";
import { Box, Typography } from "@material-ui/core";
import { useState, useEffect, useRef } from "react";
import Popper from "@material-ui/core/Popper";
// import CloseIcon from "@material-ui/icons/Close";
import FilterMenuContent from "./FilterMenuContent";
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
          : // : cat === "socioeconomic"
            "left"
        // : "left-start"
      }
      style={{
        height: "auto",
        maxHeight: "500px",
        width: "285px",
        zIndex: "1300",
        backgroundColor: "#fff",
        overflow: "auto",
      }}
      open={filterMenuOpen}
      onClose={(e) => {
        setFilterMenuOpen(false);
        setMenuTileColor(false);
        console.log(menuTileColor);
      }}
    >
      {/* <Grid container justify="flex-end" pt={2} key={cat + "filterMenuHeader"}>
        <CloseIcon
          key={cat + "filterMenuClose"}
          fontSize="small"
          color="disabled"
          onClick={(e) => {
            setFilterMenuOpen(false);
          }}
        />
      </Grid> */}
      <Box pt={1}>
        <Typography
          key="filterMenuTitle"
          gutterBottom
          align="center"
          variant="button"
          display="block"
        >
          {cat} VARIABLES
        </Typography>
      </Box>
      <Divider />
      <Box
        key="filterBox"
        style={{
          maxHeight: "450px",
          overflow: "auto",
        }}
      >
        {layerID === "1" && cat !== "accessibility" && (
          <Box m={1} fontStyle="italic" key="noFiltersBox">
            <Typography variant={"body2"} key="noFiltersText">
              To access these indicators, select "5x5km areas" resolution or
              larger from top right menu.
            </Typography>
          </Box>
        )}
        <FilterMenuContent
          key="FilterMenuContent"
          cat={cat}
          layerID={layerID}
        />
      </Box>
    </Popper>
  );
};
export default FilterMenu;
