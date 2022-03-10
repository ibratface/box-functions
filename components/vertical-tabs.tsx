import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import React, { Fragment } from 'react';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return value === index && (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      sx={{ flexGrow: 1, p: 2, textAlign: 'left', overflow: 'auto' }}
    >
      {children}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs({ tabs, panels }) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ display: 'flex' }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider', minHeight: 480, minWidth: 200 }}
      >
        {
          tabs.map((t, i) => (
            <Tab label={t} {...a11yProps(i)} key={ `tab-${i}` }/>
          ))
        }
      </Tabs>
      {
        panels.map((p, i) => (
          <TabPanel value={value} index={i} key={ `tabpanel-${i}` }>
            {p}
          </TabPanel>
        ))
      }
    </Box>
  );
}