<script>
    import { Table } from "@sveltestrap/sveltestrap";
    import { onMount, onDestroy } from "svelte";

    import {
        haCount,
        haSelName,
        haRecord,
        haStatusOpen,
        haStatusClosed,
        haShowAcctType,
    } from "../sharedState.svelte.js";

    const columns = [
        {
            key: "accountID",
            title: "ID",
            value: (v) => v.accountID,
            class: "text-start",
            headerClass: "header text-start",
        },
        {
            key: "accountName",
            title: "Name",
            value: (v) => v.accountName,
            class: "text-start ",
            headerClass: "header text-start",
        },
    ];

    let { haAcctRecordsList } = $props();

    haCount.set(haAcctRecordsList.length);

    // console.log("haList: props: ", haAcctRecordsList);

    let rows = $state([]);
    let limit = haAcctRecordsList.length;
    let rowCnt = 0;
    for (let i = 0; i < limit; i++) {
        rows.push(haAcctRecordsList[i]);
        rowCnt++;
    }


    // tell main we want details for the selected row
    const onSelect = (event) => {
        let thisTR = event.target.parentNode;
        let rowID = thisTR.dataset.key;
        let actName = thisTR.dataset.name;
        let actType = thisTR.dataset.type;
        let accountStatus = thisTR.dataset.status;
        console.log(
            "haList: onSelect: ",
            rowID,
            " : ",
            actName,
            " : ",
            actType
        );
        console.log("haList: status: ", $haStatusOpen, " : ", $haStatusClosed);
        api.send("get/haDetails", { rowID, actName, accountStatus });
        // console.log("haTable: onSelect: ", selectedRow);
    };

</script>

<main>
    <div class="container haContainer">
        {#key $haSelName}
            <Table bordered size="sm" hover>
                <thead class="header table-dark">
                    <tr>
                        {#each columns as c}
                            <th class={c.headerClass}>{c.title}</th>
                        {/each}
                    </tr>
                </thead>
                <tbody>
                    {#each rows as row}
                        {#if $haSelName != "" && row.accountName.toLowerCase().includes($haSelName)}
                            <tr
                                onclick={onSelect}
                                data-key={row.accountID}
                                data-name={row.accountName}
                                data-status={row.accountStatus}
                                data-type={row.accountType}
                            >
                                {#each columns as c}
                                    <td
                                        class={`${row.accountStatus} ${c.class}`}
                                        >{row[c.key]}
                                    </td>
                                {/each}
                            </tr>
                        {:else if $haSelName === "" && (($haStatusOpen && row.accountStatus == "open") || ($haStatusClosed && row.accountStatus == "closed")) && $haShowAcctType === row.accountType}
                            <tr
                                onclick={onSelect}
                                data-key={row.accountID}
                                data-name={row.accountName}
                                data-status={row.accountStatus}
                                data-type={row.accountType}
                            >
                                {#each columns as c}
                                    <td
                                        class={`${row.accountStatus} ${c.class}`}
                                        >{row[c.key]}
                                    </td>
                                {/each}
                            </tr>
                        {/if}
                    {/each}
                </tbody>
            </Table>
        {/key}
    </div>
</main>

<style>
    .header {
        position: sticky;
        top: 0;
    }

    .haContainer {
        width: 100%;
        height: 450px;
        overflow: auto;
    }

    .open {
        color: #18966c;
    }
    .closed {
        color: #961861;
    }
</style>
