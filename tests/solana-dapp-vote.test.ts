import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { expect } from "chai";
import { SolanaDappVote } from "../target/types/solana_dapp_vote";


function stringToU8Array16(input: string): [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] {
    const bytes = new TextEncoder().encode(input);

    if (bytes.length > 16) {
        throw new Error("Input string is too long");
    }

    const array: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < bytes.length; i++) {
        array[i] = bytes[i];
    }

    return array;
}

function stringToU8Array32(input: string): [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] {
    const bytes = new TextEncoder().encode(input);

    if (bytes.length > 32) {
        throw new Error("Input string is too long");
    }

    const array: [number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < bytes.length; i++) {
        array[i] = bytes[i];
    }

    return array;
}

// This function translates a Date into a unix timestamp
function dateToUnixTimestamp(date: Date): BN {
     return new BN(Math.floor(date.getTime() / 1000));
}

// Implement a function that wait until a specific date and time
function waitUntil(date: Date): Promise<void> {
    return new Promise((resolve) => {
        const now = new Date();
        if (date <= now) {
            resolve();
        } else {
            setTimeout(() => resolve(), (date.getTime() - now.getTime()) + 100);
        }
    });
}

// Implement a function that creates a Date object at the present time and add a number of seconds to it which will be provided by a function parameter
function addSecondsToDate(date: Date, seconds: number): Date {
    return new Date(date.getTime() + seconds * 1000);
}


describe('solana-dapp-vote unit testing', () => {
    const program = anchor.workspace.SolanaDappVote as Program<SolanaDappVote>;
    const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
    const programID = new PublicKey("5ohdRX4CdPL3vezowNBNiv6szq7tKg9jMDzK8KRRmvkM");
    let admin;
    let voter0;
    let voter1;
    let voter2;
    let proposal;
    let proposalTitle;
    let proposalDesc;
    let choices_registration_start;
    let choices_registration_end;
    let voters_registration_start;
    let voters_registration_end;
    let voting_session_start;
    let voting_session_end;

    before(async () => {

        // Configure the client to use the local cluster.
        anchor.setProvider(anchor.AnchorProvider.env());

        // Create admin
        admin = anchor.web3.Keypair.generate();

        // Create voters keypairs
        voter0 = anchor.web3.Keypair.generate();
        voter1 = anchor.web3.Keypair.generate();
        voter2 = anchor.web3.Keypair.generate();

        // Airdrops
        const AIRDROP_AMOUNT = 5;
        let txAdmin = await connection.requestAirdrop(
            admin.publicKey,
            AIRDROP_AMOUNT * anchor.web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(txAdmin);
        let txVoter0 = await connection.requestAirdrop(
            voter0.publicKey,
            AIRDROP_AMOUNT * anchor.web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(txVoter0);
        let txVoter1 = await connection.requestAirdrop(
            voter1.publicKey,
            AIRDROP_AMOUNT * anchor.web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(txVoter1);
        let txVoter2 = await connection.requestAirdrop(
            voter2.publicKey,
            AIRDROP_AMOUNT * anchor.web3.LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(txVoter2);

        
    });

    beforeEach(async () => {
        // We create a proposal
        proposal = Keypair.generate();
        proposalTitle = "title test";
        proposalDesc = "desc test";
        const STEP_IN_SECONDS = 5;
        choices_registration_start = addSecondsToDate(new Date(), STEP_IN_SECONDS);
        choices_registration_end = addSecondsToDate(choices_registration_start, STEP_IN_SECONDS);
        voters_registration_start = addSecondsToDate(choices_registration_end, STEP_IN_SECONDS);
        voters_registration_end = addSecondsToDate(voters_registration_start, STEP_IN_SECONDS);
        voting_session_start = addSecondsToDate(voters_registration_end, STEP_IN_SECONDS);
        voting_session_end = addSecondsToDate(voting_session_start, STEP_IN_SECONDS);

        await program.methods
            .createProposal(
                stringToU8Array16(proposalTitle), 
                stringToU8Array32(proposalDesc), 
                dateToUnixTimestamp(choices_registration_start), 
                dateToUnixTimestamp(choices_registration_end),
                dateToUnixTimestamp(voters_registration_start),
                dateToUnixTimestamp(voters_registration_end),
                dateToUnixTimestamp(voting_session_start),
                dateToUnixTimestamp(voting_session_end),
            )
            .accounts({
                proposal: proposal.publicKey,
                admin: admin.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([admin, proposal])
            .rpc();
    });

    // 1. create_proposal tests
    describe('create_proposal', () => {

        it('can create a new proposal with valid parameters', async () => {
            // Fetch the proposal account data
            const proposalAccount = await program.account.proposal.fetch(proposal.publicKey);

            // Verify the proposal data
            expect(proposalAccount.title).to.eql(stringToU8Array16(proposalTitle));
            expect(proposalAccount.description).to.eql(stringToU8Array32(proposalDesc));            
            expect(proposalAccount.choices).to.eql([]);
            
            expect(proposalAccount.choicesRegistrationInterval.start.eq(dateToUnixTimestamp(choices_registration_start))).to.be.true;
            expect(proposalAccount.choicesRegistrationInterval.end.eq(dateToUnixTimestamp(choices_registration_end))).to.be.true;
            expect(proposalAccount.votersRegistrationInterval.start.eq(dateToUnixTimestamp(voters_registration_start))).to.be.true;
            expect(proposalAccount.votersRegistrationInterval.end.eq(dateToUnixTimestamp(voters_registration_end))).to.be.true;
            expect(proposalAccount.votingSessionInterval.start.eq(dateToUnixTimestamp(voting_session_start))).to.be.true;
            expect(proposalAccount.votingSessionInterval.end.eq(dateToUnixTimestamp(voting_session_end))).to.be.true
    
        });

        it('fails to create a proposal with invalid parameters', async () => {
            proposal = Keypair.generate();
            proposalTitle = stringToU8Array16("title test");
            proposalDesc = stringToU8Array32("desc test");

            try {
                await program.methods
                .createProposal(
                    proposalTitle, 
                    proposalDesc, 
                    dateToUnixTimestamp(new Date("2023-07-17 14:00:00")), 
                    dateToUnixTimestamp(new Date("2023-07-16 15:00:00")), 
                    dateToUnixTimestamp(new Date("2023-07-18 16:00:00")), 
                    dateToUnixTimestamp(new Date("2023-07-17 17:00:00")), 
                    dateToUnixTimestamp(new Date("2023-07-19 18:00:00")), 
                    dateToUnixTimestamp(new Date("2023-07-18 19:00:00")), 
                )
                .accounts({
                    proposal: proposal.publicKey,
                    admin: admin.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([admin, proposal])
                .rpc();

                throw new Error("The transaction should have failed");
            }
            catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("Timeline is invalid");
            }

        });
    });

    // 2. add_choice_for_one_proposal tests
    describe('add_choice_for_one_proposal', () => {

        it.skip('it will add a choice to an existing proposal', async () => {

            // TODO: Fix this test

            console.log("choices_registration_start: ", choices_registration_start);
            console.log("choices_registration_end: ", choices_registration_end);
            await waitUntil(choices_registration_start);
            console.log("Now: ", new Date());

            const choice0 = stringToU8Array16("choice0");
            let txChoice0 = await program.methods
                .addChoiceForOneProposal(choice0)
                .accounts({
                    proposal: proposal.publicKey,
                    admin: admin.publicKey,
                })
                .signers([admin])
                .rpc();

            await connection.confirmTransaction(txChoice0);

            /*
            const proposalAccount = await program.account.proposal.fetch(proposal.publicKey);           
            expect(proposalAccount.choices).to.eql([]);
            */
        });

        it('it fails to add a choice to an existing proposal because registration is not opened', async () => {

            try{
                const choice0 = stringToU8Array16("choice 0");
                
                await program.methods
                .addChoiceForOneProposal(choice0)
                .accounts({
                    proposal: proposal.publicKey,
                    admin: admin.publicKey,
                })
                .signers([admin])
                .rpc();
            }
            catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("Choices registration is closed");
            }
        });

        it('it fails to add a choice to a non existing proposal', async () => {

            let nonExistingProposal = Keypair.generate();

            await waitUntil(choices_registration_start);

            try{
                const choice0 = stringToU8Array16("choice 0");
                let txChoice0 = await program.methods
                .addChoiceForOneProposal(choice0)
                .accounts({
                    proposal: nonExistingProposal.publicKey,
                    admin: admin.publicKey,
                })
                .signers([admin])
                .rpc();
            }
            catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("The program expected this account to be already initialized");
            }
        });

        it("it won't add a choice to an existing proposal if not the admin", async () => {
            
            await waitUntil(choices_registration_start);

            try{
                const choice0 = stringToU8Array16("choice 0");
                let txChoice0 = await program.methods
                .addChoiceForOneProposal(choice0)
                .accounts({
                    proposal: proposal.publicKey,
                    admin: voter0.publicKey,
                })
                .signers([admin])
                .rpc();
            }
            catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("unknown signer");
            }
        })

        it("can't add more than ten choices to a proposal", async () => {
            await waitUntil(choices_registration_start);

            // TODO: Fix this test
            /*
            for (let i = 0; i < 10; i++) {
                const choice = stringToU8Array16(`choice ${i}`);
                let tx = await program.rpc.addChoiceForOneProposal(choice, {
                    accounts: {
                        proposal: proposal.publicKey,
                        admin: admin.publicKey,
                    },
                    signers: [admin],
                });
                await connection.confirmTransaction(tx);
            }
                */
        });
    });

    describe('register_voter', () => {
        it.skip('can register a voter during registration period', async () => {

            await waitUntil(voters_registration_start);

            const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                programID
            );
            let txRegisterVoter0 = await program.methods
                .registerVoter(voter0.publicKey)
                .accounts({
                    proposal: proposal.publicKey,
                    ballot: ballot0AccountAddr,
                    admin: admin.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([admin])
                .rpc();
            
            await connection.confirmTransaction(txRegisterVoter0);
        });

        it.skip('fails to register a voter outside of registration period', async () => {
            try {
                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    programID
                );
                let txRegisterVoter0 = await program.methods
                    .registerVoter(voter0.publicKey)
                    .accounts({
                        proposal: proposal.publicKey,
                        ballot: ballot0AccountAddr,
                        admin: admin.publicKey,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    })
                    .signers([admin])
                    .rpc();
                
                await connection.confirmTransaction(txRegisterVoter0);

            } catch (error) {
                expect(error).to.be.an('error');
                console.log((error as Error).message);
                expect((error as Error).message).to.include("Voters registration is closed");
            }
        });

        it('only allows admin to register a voter', async () => {
           try {
                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    programID
                );
                let txRegisterVoter0 = await program.methods
                    .registerVoter(voter0.publicKey)
                    .accounts({
                        proposal: proposal.publicKey,
                        ballot: ballot0AccountAddr,
                        admin: voter0.publicKey,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    })
                    .signers([admin])
                    .rpc();
                
                await connection.confirmTransaction(txRegisterVoter0);

            } catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("unknown signer");
            }
        });
    });

    describe('cast_vote', () => {
       
        it.skip('can cast a valid vote', async () => {
            await waitUntil(voters_registration_start);

            const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                programID
            );
            let txRegisterVoter0 = await program.methods
                .registerVoter(voter0.publicKey)
                .accounts({
                    proposal: proposal.publicKey,
                    ballot: ballot0AccountAddr,
                    admin: admin.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([admin])
                .rpc();
            
            await connection.confirmTransaction(txRegisterVoter0);

            waitUntil(voting_session_start);

            // Cast vote for voter0
            let txCastVote0 = await program.methods
                .castVote(1)
                .accounts({
                    proposal: proposal.publicKey,
                    ballot: ballot0AccountAddr,
                    voter: voter0.publicKey,
                })
                .signers([voter0])
                .rpc();
                
            await connection.confirmTransaction(txCastVote0);
        });

        it.skip('fails to cast a vote outside of voting period', async () => {

            try {
                await waitUntil(voters_registration_start);

                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    programID
                );
                let txRegisterVoter0 = await program.methods
                    .registerVoter(voter0.publicKey)
                    .accounts({
                        proposal: proposal.publicKey,
                        ballot: ballot0AccountAddr,
                        admin: admin.publicKey,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    })
                    .signers([admin])
                    .rpc();
                
                await connection.confirmTransaction(txRegisterVoter0);

                // Cast vote for voter0
                let txCastVote0 = await program.methods
                    .castVote(1)
                    .accounts({
                        proposal: proposal.publicKey,
                        ballot: ballot0AccountAddr,
                        voter: voter0.publicKey,
                    })
                    .signers([voter0])
                    .rpc();
                    
                await connection.confirmTransaction(txCastVote0);

            } catch (error) {
                expect(error).to.be.an('error');
                console.log((error as Error).message);
                expect((error as Error).message).to.include("Voting session is closed");
            }
        });

        it.skip('fails to cast a vote for an invalid choice', async () => {
            try {
                await waitUntil(voters_registration_start);

                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    programID
                );
                let txRegisterVoter0 = await program.methods
                    .registerVoter(voter0.publicKey)
                    .accounts({
                        proposal: proposal.publicKey,
                        ballot: ballot0AccountAddr,
                        admin: admin.publicKey,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    })
                    .signers([voter0])
                    .rpc();
                
                await connection.confirmTransaction(txRegisterVoter0);

                waitUntil(voting_session_start);

                // Cast vote for voter0
                let txCastVote0 = await program.methods
                    .castVote(100)
                    .accounts({
                        proposal: proposal.publicKey,
                        ballot: ballot0AccountAddr,
                        voter: voter0.publicKey,
                    })
                    .signers([voter0])
                    .rpc();
                    
                await connection.confirmTransaction(txCastVote0);

            } catch (error) {
                expect(error).to.be.an('error');
                console.log((error as Error).message);
                expect((error as Error).message).to.include("Invalid choice index");
            }
        });

    });
});
