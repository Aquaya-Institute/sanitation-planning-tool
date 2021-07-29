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
  // tabIndex,
}) => {
  const [menuTileColor, setMenuTileColor] = useState(false);
  const clickRefMenu = useRef(null);
  const clickRefData = useRef(null);
  // const [popoverOpen, setPopoverOpen] = useState(false);

  //click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        clickRefMenu.current &&
        !clickRefMenu.current.contains(event.target)
      ) {
        if (
          clickRefData.current &&
          !clickRefData.current.contains(event.target)
        ) {
          // setPopoverOpen(null);
        } else if (
          clickRefData.current &&
          clickRefData.current.contains(event.target)
        ) {
        } else {
          setFilterMenuOpen(false);
          setSelectedMenu(null);
        }
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [setFilterMenuOpen, setSelectedMenu]);

  useEffect(() => {
    // document.getElementById("filterBox").focus();
    if (clickRefMenu.current) {
      clickRefMenu.current.focus();
    }
  }, []);

  return (
    <Popper
      id={cat + "filterMenu"}
      ref={clickRefMenu}
      key={cat + "filterMenu"}
      anchorEl={anchorEl}
      placement={
        cat === "health" || cat === "socioeconomic"
          ? "left-end"
          : // : cat === "socioeconomic"
            "left"
        // : "left-start"
      }
      style={{
        height: "auto",
        maxHeight: "500px",
        width: "275px",
        zIndex: "1300",
        backgroundColor: "#fff",
        overflow: "auto",
      }}
      open={filterMenuOpen}
      onClose={(e) => {
        setFilterMenuOpen(false);
        setMenuTileColor(false);
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
          maxHeight: "400px",
          overflow: "auto",
        }}
        id="filterBox"
      >
        <Box
          key="filter instructions"
          p={1}
          variant="subtitle2"
          fontStyle="italic"
          fontSize={13.5}
          fontWeight="fontWeightBold"
        >
          Drag the minimum and maximum values to set desired value criteria for
          each filter:
        </Box>
        {layerID === "1" && cat !== "accessibility" && (
          <Box m={1} fontStyle="italic" key="noFiltersBox">
            <Typography variant={"body2"} key="noFiltersText">
              To access these indicators, select "5x5km areas" resolution or
              larger from top right menu.
            </Typography>
          </Box>
        )}
        {layerID === "5" && cat !== "accessibility" && cat !== "socioeconomic" && (
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
          clickRefData={clickRefData}
          // tabIndex={tabIndex}
          // setPopoverOpen={setPopoverOpen}
        />
      </Box>
    </Popper>
  );
};
export default FilterMenu;
