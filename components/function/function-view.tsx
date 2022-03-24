import { Backdrop, Box, Breadcrumbs, CircularProgress, Container, Link, Typography } from "@mui/material";
import { Fragment } from "react";

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import FunctionCredentials from "../../components/function/function-credentials";
import FunctionSource from "../../components/function/function-source";
import TabView from "../../components/tab-view";
import { useFunction } from "../../lib/client/box-function";
import TriggerList from "../trigger/trigger-list";


export default function FunctionView({ functionId }) {
  const fn = useFunction(functionId)

  return (
    <Fragment>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={!fn.name && true}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ p: 1 }}>
        <Link underline="hover" color="inherit" href="/">
          <Typography variant="button">Home</Typography>
        </Link>
        <Typography variant="button">Function {fn.name}</Typography>
      </Breadcrumbs>
      <TabView
        tabs={[
          'Function',
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }} key='credentials'>
            <Typography variant='body2'> Credentials </Typography>
            {fn.credential?.value ? null : <ErrorOutlineIcon color="error" />}
          </Box>,
          'Triggers'
        ]}
        panels={[
          <FunctionSource key="code"
            run={fn.run}
            source={fn.source}
            updateSource={fn.updateSource}
            payload={fn.payload}
            updatePayload={fn.updatePayload}
          />,
          <FunctionCredentials key="credentials"
            credential={fn.credential}
            updateCredential={fn.updateCredential}
          />,
          <TriggerList></TriggerList>]}
      />
    </Fragment >)
}