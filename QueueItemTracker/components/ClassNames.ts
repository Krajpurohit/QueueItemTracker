import { DefaultPalette, mergeStyleSets } from "@fluentui/react/lib/Styling";

export const ClassNames = mergeStyleSets({
  arrowTail: {
    marginTop: "1.4vh",
    width: "100%",
    background: DefaultPalette.themePrimary,
    height: "1vh"
  },
  arrowHeadRTL: {
    transform:"rotate(180deg)",
    width: "0",
    height: "0",
    borderTop: "2vh solid transparent",
    borderBottom: "2vh solid transparent",
    borderLeft: `3vh solid ${DefaultPalette.themePrimary}`
  },
  arrowHead: {
    width: "0",
    height: "0",
    borderTop: "2vh solid transparent",
    borderBottom: "2vh solid transparent",
    borderLeft: `3vh solid ${DefaultPalette.themePrimary}`
  },
  State: {
    padding:"10px",
    marginTop:"-10px",
    backgroundColor: DefaultPalette.themeLighter
  },
  TransitionLabel: {
    marginTop: "2.8vh",
    whiteSpace: "nowrap"
  },
  Wrapper: {
    height: "40vh",
    position: "relative",
    maxHeight: "inherit",
    overflow: "auto",
    paddingTop: "10px"
  },
  personaAsButton:{
    paddingRight:"5px",
    selectors:{
      ':hover':{
        backgroundColor:DefaultPalette.blackTranslucent40
      }
    }
  }
});
