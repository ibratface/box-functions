import { Backdrop, Box, Breadcrumbs, Button, CircularProgress, Container, Link, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthGuard from "../../components/auth-guard";
import Header from "../../components/header";
import FunctionView from "../../components/function/function-view";


export default function Function() {
  const { query: { functionId } } = useRouter()

  return (
    <Container>
      <AuthGuard>
        <Header />
        {functionId ? <FunctionView functionId={functionId}></FunctionView> : null}
      </AuthGuard>
    </Container>
  )
}