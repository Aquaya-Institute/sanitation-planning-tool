import { Container, Typography, Box, Paper } from "@material-ui/core";
// import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import HomeFooter from "../components/Home/HomeFooter";

var link = document.createElement("meta");
link.setAttribute("name", "about page description");
link.content =
  "The about page gives a short description of the tool and its intended use, and the organizations involved in the creation of the tool.";
document.getElementsByTagName("head")[0].appendChild(link);

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     padding: theme.spacing(2),
//     textAlign: "left",
//   },
// }));
function Privacy() {
  // const classes = useStyles();
  return (
    <>
      <Container m={2}>
        <br />
        <Paper elevation={0}>
          <Box p={2}>
            Thank you for visiting [URL]. This is a contractor-operated website
            funded by the U.S. Agency for International Development (USAID)
            Bureau for Policy, Planning, and Learning. This site was developed
            for interactive public use, it is not an official U.S. Government
            website, and therefore does not necessarily state or reflect the
            views or opinions of the U.S. Government or USAID. Except as
            provided below, any data collected, maintained or stored within this
            site is either in the public domain or owned and controlled by The
            Aquaya Institute (“Aquaya”), not USAID. Individuals seeking USAID
            information should visit the agency's official government website at{" "}
            <a href="www.usaid.gov">www.usaid.gov</a>.
          </Box>
          <Box p={2}>
            <Typography variant="h5" p={2}>
              PRIVACY NOTICE
            </Typography>
            This section explains how Aquaya will handle information learned
            about you from your visit to this site.
          </Box>
          <Box p={2}>
            <Typography variant="h6">
              Information Automatically Collected:
            </Typography>
            <br />
            If you visit the site to browse, read, or download information:
            <br />
            Aquaya will collect and store only the following information about
            you: the name of the domain from which you access the Internet (for
            example, aol.com, if you are connecting from an America Online
            account, or berkeley.edu, if you are connecting from the University
            of California at Berkeley domain); referring site details (such as
            the URI you came through to arrive at the site; the type of
            operating system and web browser you use:, the flash version,
            JavaScript support, screen resolution and screen color processing
            ability; the network location and IP address; the date and time you
            access the site; the time you spend on each page of the site; and
            what information you view while you visit the site.
            <br />
            Aquaya will use this information to measure the number of visitors
            to the different sections of the site, to find out what information
            is the most viewed, and to help make the site more useful to
            visitors. This gathering and storing of information is separate from
            the activity described as monitoring in the Security Notice.
            <br />
            The information gathered is used primarily for the site management
            described above and may be used in the case of suspected
            unauthorized activity, for law enforcement and possible criminal
            prosecution (see Security Notice below).
          </Box>
          <Box p={2}>
            <Typography variant="h6">
              Information Voluntarily Provided and Collected:
            </Typography>
            <br />
            If you upload data to the site for analysis services that are
            provided by the site, the site will analyze the uploaded data and
            return the results to you but will not store the data or the
            analysis results.
            <br />
            If you identify yourself by sending a comment or other
            communication, using our contact information provided below, or by
            sending an email:
            <br />
            You have voluntarily provided Aquaya with potentially personally
            identifiable information. Aquaya may use that personally
            identifiable information to respond to your comment, suggestion, or
            question. Aquaya may forward this information to USAID. If it is
            determined another U.S. Government Agency or Department is in a
            better position to respond to your correspondence, Aquaya may
            forward it to them for response. In aggregate, the information may
            be used to count the number of people corresponding with us via the
            contact page or email. Aquaya will not obtain personally
            identifiable information about you when you visit this site unless
            you choose to provide such information to it.
          </Box>
          <Box p={2}>
            <Typography variant="h6">
              Cookies and Other Information Stored on Your Computer
            </Typography>
            <br />
            This site uses temporary or "session" cookies to keep track of
            activities during each session. These cookies allow the system to
            identify the responses from users as they use site features and are
            deleted by the system when the user logs off or closes the browser,
            thereby ending the session.
            <br />
            This site does NOT use "persistent" cookies.
            <br />
            Some of the links on this site point to third-party websites not
            affiliated with this site or Aquaya that may place cookies on your
            computer. You can expect this to occur when you are leaving this
            site when you select one of these links. If you want to avoid such
            cookies, we encourage you to set your browser to notify you when
            cookies are being set and allow you to reject them. Your system's
            help files will explain how to do this.
          </Box>
          <Box p={2}>
            <Typography variant="h6">Security Notice</Typography>
            <br />
            For SITE SECURITY purposes and to ensure that this service remains
            available to all users, this system employs software programs to
            monitor network traffic to identify unauthorized attempts to upload
            or change information, or otherwise cause damage.
            <br />
            If monitoring reveals evidence of possible criminal activity, such
            evidence may be provided to law enforcement personnel.
          </Box>
          <Box p={2}>
            <Typography variant="h6">General Disclaimer</Typography>
            <br />
            This site does not state or reflect the views or opinions of the
            U.S. Government or USAID. If you require official USAID information,
            please obtain it directly from{" "}
            <a href="www.usaid.gov">www.usaid.gov</a> and not through other
            sources that may change the information in some way to make it
            inaccurate or exclude material necessary to the understanding of
            that information.
          </Box>
          <Box p={2}>
            <Typography variant="h6">Disclaimer of Endorsement</Typography>
            <br />
            The information on this site may contain hypertext links or pointers
            to information created and maintained on the websites of other
            public and private organizations. These links and pointers are
            provided for visitors' convenience. Aquaya does not control or
            guarantee the accuracy, relevance, timeliness or completeness of any
            linked information. In addition, the inclusion of links or pointers
            to other websites is not intended to assign importance to those
            sites and the information contained therein, nor is it intended to
            endorse, recommend or favor any views expressed, or commercial
            products or services offered on these outside sites, or the
            organizations sponsoring the sites, by trade name, trademark,
            manufacture, or otherwise. Further, Aquaya cannot authorize the
            copying or use of copyrighted material contained in a linked
            website. Visitors must request such authorization from the sponsor
            of the linked website. Finally, Aquaya does not guarantee that any
            linked website will comply with Section 508 (Accessibility
            Requirements) of the Rehabilitation Act.
            <br />
            Reference in this site to any specific commercial products,
            processes or services, or the use of any trade, firm, or corporation
            name is for the information and convenience of the site's visitors,
            and does not constitute endorsement, recommendation or favoring by
            the U.S. Government, USAID or Aquaya.
            <br />
            The views and opinions of authors expressed herein do not state or
            reflect those of the U.S. Government or USAID and shall not be used
            for advertising or product endorsement purposes.
          </Box>
          <Box p={2}>
            <Typography variant="h6">Disclaimer of Liability</Typography>
            <br />
            Reasonable efforts are made to provide accurate and complete
            information. However, Aquaya cannot guarantee that there will be no
            errors. Aquaya makes no claims, promises, or guarantees about the
            accuracy, completeness, or adequacy of the contents of this site and
            expressly disclaims liability for errors and omissions in the
            contents of this site.
            <br />
            With respect to the content of this site, neither the United States
            Government, USAID or Aquaya, nor their respective employees and
            contractors make any warranty, expressed or implied or statutory,
            including but not limited to the warranties of non-infringement of
            third-party rights, title, and the warranties of Merchantability and
            Fitness for a Particular Purpose with respect to content available
            from this site or other Internet resources linked from it.
            <br />
            Neither the U.S. Government, USAID or Aquaya assume any legal
            liability for the accuracy, completeness or usefulness of any
            information, product, or process disclosed herein, nor freedom from
            computer viruses, and do not represent that use of such information,
            product or process will not infringe on privately owned rights.
          </Box>
          <Box p={2}>
            <Typography variant="h6">
              Links to this Site or Its Contents
            </Typography>
            <br />
            You may freely link to this site or any of its content. Aquaya asks
            only that you use the full URL and identify that the link is to a
            public Internet resource.
          </Box>
          <Box p={2}>
            <Typography variant="h6">Links to Other Sites</Typography>
            <br />
            Our site may include links to other U.S. Government agencies and to
            private organizations. Once you link to another site, you are
            subject to the disclaimers and security and privacy policies of the
            new site.
          </Box>
          <Box p={2}>
            <Typography variant="h6">Copyright Notice</Typography>
            <br />
            Unless a copyright is indicated, information on this site is in the
            public domain and may be reproduced, published, or otherwise used
            without permission. Aquaya requests only that Aquaya, this site and
            USAID be cited as the source of the information and that any photo
            credits or bylines be similarly credited to the photographer or
            author as appropriate.
            <br />
            If a copyright is indicated on a photo, graphic or any other
            material, permission to copy these materials must be obtained from
            the original source.
            <br />
            This copyright notice does not pertain to information on websites
            other than this site.
          </Box>
          <Box p={2}>
            <Typography variant="h6">Site Management</Typography>
            <br />
            Aquaya manages the overall information content, design and
            organization of this site.
          </Box>
          <Box p={2}>
            <Typography variant="h6">Changes to Our Privacy Policy</Typography>
            <br />
            We keep our privacy policy under regular review and will place any
            updates on this web page.
          </Box>
          <Box p={2}>
            <Typography variant="h6">Contacting Us</Typography>
            <br />
            If there are any questions regarding this privacy policy, this site
            or Aquaya, you may contact us using the information below: [TBD]
          </Box>
        </Paper>
      </Container>
      <HomeFooter />
    </>
  );
}
export default Privacy;
