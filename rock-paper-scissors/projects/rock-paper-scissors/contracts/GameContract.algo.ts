import { Contract } from '@algorandfoundation/tealscript';


export class Fight extends Contract {


    player1 = GlobalStateKey<Address>();
  
    player2 = GlobalStateKey<Address>();
    depositedAmount = GlobalStateKey<uint64>();
    maxDepositAmount = GlobalStateKey<uint64>();
    winner = GlobalStateKey<Address>();
    player1Move = BoxKey<string>({key:'player1Move',dynamicSize: true});
    player2Move = BoxKey<string>({key:'player2Move',dynamicSize: true});

    status = GlobalStateKey<string>(); // Possible values: 'Active', 'Expired'

    createApplication(player1: Address, player2: Address): void {

        
        this.player1.value = player1;
        this.player2.value = player2;
        this.depositedAmount.value = 0;
        this.maxDepositAmount.value = 5;


      }
      createBox(): void {
        this.player1Move.create(400)
        this.player2Move.create(400)

      }

      depositfunds(ftransx : Txn){
        assert(
            this.txn.sender === this.app.creator ||
              this.txn.sender === this.player1.value ||
              this.txn.sender === this.player2.value
          );

          verifyPayTxn(ftransx, {
            receiver: this.app.address,


        });
        this.depositedAmount.value += ftransx.assetAmount;




      }
      sendFunds (player: Address){

        assert(
            this.txn.sender === this.app.creator
          );
          sendPayment({
            receiver: player,
            amount: this.depositedAmount.value,
          });
          this.depositedAmount.value = 0;



      }


      joinGame (player: Address){
        assert(
            !this.player2.exists
          );

          this.player2.value =player;

      }





}