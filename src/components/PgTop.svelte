<script>
    import { Container, Row, Col } from "@sveltestrap/sveltestrap";


    let tmpData = localStorage.getItem("appData");
    let appData = tmpData.replace(/#/g, "\\");
    let ihLogo = appData + "/images/ih-logo.png";
    let cbLogo = appData + "/images/cb-logo.png";

    console.log("PgTop: appData: ", appData);
    console.log("PgTop: ihLogo: ", ihLogo);
    console.log("PgTop: cbLogo: ", cbLogo);
    // console.log("ihLogo: ", ihLogo);
    // console.log("cbLogo: ", cbLogo);

</script>

<main>
    <Container>
        <Row class="align-items-center">
            <Col xs="6">
                <img src={ihLogo} alt="IH Logo" width="300" height="100" />
            </Col>
            <Col xs="6">
                <img src={cbLogo} alt="CB Logo" width="240" height="40" />
            </Col>
        </Row>
    </Container>
</main>


<style>

</style>
