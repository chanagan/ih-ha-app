<script>
    import { Container, Row, Col } from "@sveltestrap/sveltestrap";
    import HaHeader from "../components/HaHeader.svelte";
    import HaStatus from "../components/HaStatus.svelte";

    import { onMount, onDestroy } from "svelte";
    import HaList from "../components/HaList.svelte";
    import HaDetails from "../components/HaDetails.svelte";
    import HaSpecial from "../components/HaSpecial.svelte";

    let haList = $state(false);
    let haAcctRecordsList = $state([]);

    onMount(() => {
        console.log("rend:ha onMount");
        window.addEventListener("message", showHAs);
        api.send("get/ha", {});
    });

    onDestroy(() => {
        console.log("rend: onDestroy");
        window.removeEventListener("message", showHAs);
    });

    const showHAs = (event) => {
        console.log("rend: ha: event: ", event);
        if (event.data.type === "haList") {
            haList = true;
            haAcctRecordsList = event.data.haAcctRecordsList;
            // console.log("rend: event: ", haAcctRecordsList);
        }
    };
</script>

<main>

    <hr size="3" color="red" />
    <div class="container">
        <div class="row ">
            <div class="col-12">
                <h1>House Accounts</h1>
            </div>
        </div>
        <div class="row  align-items-end">
            <div class=col-6>
                <HaHeader />
            </div>
            <div class=col-1>
                <HaStatus />
            </div>
            <div class=col-2>
                <HaSpecial />
            </div>
        </div>
        <hr size="3" color="red" />
        <div class="row">
            <div class="col-5">
                {#if haList}
                    {#key haAcctRecordsList}
                        <HaList {haAcctRecordsList} />
                    {/key}
                {/if}
            </div>
            <div class="col-7">
                <HaDetails />
            </div>
        </div>
    </div>

</main>
<style>

</style>