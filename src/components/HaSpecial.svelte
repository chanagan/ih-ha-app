<script>
    import { Input } from "@sveltestrap/sveltestrap";
    import { onMount } from "svelte";

    import { haShowAcctType } from "../sharedState.svelte.js";

    let radioGroup = $state('a');
    onMount(() => {
        haShowAcctType.set('a');        
    })

    const selAcctType = (e) => {
        let selAcctType = e.currentTarget.value;
        console.log("selAcctType", selAcctType);
        haShowAcctType.set(selAcctType);
    };

    // let radioValue = $state();

    const options = [
        {
            value: "a",
            label: "Regular",
        },
        {
            value: "g",
            label: "Gift Card",
        },
        {
            value: "e",
            label: "Employee",
        },
    ];
</script>

{#each options as { value, label }}
    <span class={value}>
        <Input
            reverse
            type="radio"
            bind:group={radioGroup}
            {value}
            {label}
            onclick={selAcctType}
        />
    </span>
{/each}

<style>
    .a {
        color: #333333;
        font-weight: bold;
    }
    .g {
        color: #cc9900;
        font-weight: bold;
    }
    .e {
        color: #ff6633;
        font-weight: bold;
    }
</style>
