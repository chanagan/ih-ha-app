<script>
  import {haRecord} from '../sharedState.svelte.js';
  import {Table, Icon, Container, Row, Col} from '@sveltestrap/sveltestrap';

  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from '@sveltestrap/sveltestrap';

  const nFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const columns = [
    {
      key: 'balance',
      title: 'Balance',
      value: (v) => v.charges.balance,
      renderValue: (v) => nFormat.format(v.charges.balance),
      class: 'text-end',
      headerClass: 'text-end',
    },
    {
      key: 'monMin',
      title: 'Minimum',
      value: (v) => v.charges.monMin,
      renderValue: (v) => nFormat.format(v.charges.monMin),
      class: 'text-end',
      headerClass: 'text-end',
    },
    {
      key: 'minDelta',
      title: 'Delta',
      value: (v) => v.charges.minDelta,
      renderValue: (v) => nFormat.format(v.charges.minDelta),
      class: 'text-end',
      headerClass: 'text-end',
    },
    {
      key: 'minTax',
      title: '7.5%',
      value: (v) => v.charges.minTax,
      renderValue: (v) => nFormat.format(v.charges.minTax),
      class: 'text-end',
      headerClass: 'text-end',
    },
    {
      key: 'subTot',
      title: 'Sub Total',
      value: (v) => v.charges.subTot,
      renderValue: (v) => nFormat.format(v.charges.subTot),
      class: 'text-end',
      headerClass: 'text-end',
    },
    {
      key: 'creChg',
      title: '3%',
      value: (v) => v.charges.creChg,
      renderValue: (v) => nFormat.format(v.charges.creChg),
      class: 'text-end',
      headerClass: 'text-end',
    },
    {
      key: 'totChg',
      title: 'Total',
      value: (v) => v.charges.totChg,
      renderValue: (v) => nFormat.format(v.charges.totChg),
      class: 'text-end',
      headerClass: 'text-end',
    },
  ];

  let row = $state();
  row = $haRecord;
  let actionLabel = row.accountType === 'e' ? 'Invoice' : 'Charge';
  console.log('haDetTable: row accountType => ', row.accountType);

  let open = $state(false);
  let size = $state('md');

  const enterCharges = () => {
    console.log('enterCharges');
    console.log('haRecord: ', $haRecord);
    if (row.charges.minDelta > 0) {
      api.send('postAcctCharge', {
        accountID: row.accountID,
        accountName: $haRecord.accountName,
        accountStatus: $haRecord.accountStatus,
        adjustAmt: row.charges.minDelta,
        ccService: row.charges.creChg,
      });

    } else {
      api.send('postCCService', {
        accountID: row.accountID,
        accountName: $haRecord.accountName,
        accountStatus: $haRecord.accountStatus,
        ccService: row.charges.creChg,
      });
    }
    open = false;
  };
  const cancel = () => {
    open = false;
  };
  const showDialog = () => {
    if (row.charges.totChg <= 0) {
      alert('No charges to enter');
      open = false;
    } else {
      open = true;
    }
  };
  const toggle = () => {
    console.log('clicked X');
    open = false;
  };
  const makeEmpBill = () => {
    if (row.charges.totChg <= 0) {
      alert('No charges to enter');
    } else {
      alert('Employee bill in "downloads/ih_emp" directory');
      api.send('generateEmployeeInvoice', $haRecord)
      }
  };
</script>

<main>
    <Table bordered size="sm">
        <thead class="table-dark">
        <tr>
            {#each columns as c}
                <th class={c.headerClass}>{c.title}</th>
            {/each}
            <th class="text-center">{actionLabel}</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            {#each columns as c}
                <td class={c.class}>{nFormat.format(row.charges[c.key])}</td
                >
            {/each}
            <td class="text-center">
                <!-- want to make employee bill in excel -->
                {#if row.accountType === 'e'}
                    <Icon
                            name="printer"
                            style="font-size: 1.5em"
                            onclick={makeEmpBill}
                    />
                {:else}
                    <Icon
                            name="credit-card-2-front"
                            style="font-size: 1.5em"
                            onclick={showDialog}
                    />
                {/if}
                <!-- <Icon name="door-open" /> -->
                <!-- <Icon name="credit-card-2-front" /> -->
                <!-- <Icon name="file-excel" /> -->
                <!-- <Icon name="printer" /> -->
            </td>
        </tr>
        </tbody>
    </Table>

    <Modal isOpen={open} {size} backdrop="static" {row}>
        <ModalHeader {toggle} class="text-center"
        >First of Month: {row.accountName}</ModalHeader
        >
        <ModalBody>
            <Container>
                <Row>
                    <Col xs="9">Current Balance:</Col>
                    <Col xs="3" class="text-end">
                        {nFormat.format(row.charges.balance)}</Col
                    >
                </Row>
                <Row>
                    <Col xs="9">Minimum Adjustment:</Col>
                    {#if row.charges.minDelta != 0}
                        <Col
                                xs="3"
                                class="text-end "
                                style="border: 3px solid red"
                        >
                            {nFormat.format(row.charges.minDelta)}</Col
                        >
                    {:else}
                        <Col xs="3" class="text-center">N/A</Col>
                    {/if}
                </Row>
                <Row>
                    <Col xs="9">Florida Tax - 7.5%:</Col>
                    <Col xs="3" class="text-end">
                        {nFormat.format(row.charges.minTax)}</Col
                    >
                </Row>
                <Row>
                    <Col xs="9">Sub Total:</Col>
                    <Col xs="3" class="text-end">
                        {nFormat.format(row.charges.subTot)}</Col
                    >
                </Row>
                <Row>
                    <Col xs="9">CC Service Charge - 3%:</Col>
                    <Col xs="3" class="text-end " style="border: 3px solid red">
                        {nFormat.format(row.charges.creChg)}</Col
                    >
                </Row>
                <Row>
                    <Col xs="9">Total:</Col>
                    <Col xs="3" class="text-end">
                        {nFormat.format(row.charges.totChg)}</Col
                    >
                </Row>
            </Container>
        </ModalBody>
        <ModalFooter>
            <Button size="sm" color="secondary" onclick={cancel}>Cancel</Button>
            <Button size="sm" color="primary" onclick={enterCharges}
            >Enter Additional Charge(s)
            </Button
            >
        </ModalFooter>
    </Modal>
</main>

<style>
</style>
