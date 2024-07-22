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
function dateToUnixTimestampBN(date: Date): BN {
     return new BN(Math.floor(date.getTime() / 1000));
}

function dateToUnixTimestamp(date: Date): number {
    return Math.floor(date.getTime() / 1000);
}

// Implement a function that wait until a specific date and time
function waitUntil(date: Date): Promise<void> {
    return new Promise((resolve) => {
        const now = new Date();
        if (date <= now) {
            resolve();
        } else {
            setTimeout(() => resolve(), (date.getTime() - now.getTime()) + 2000);
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
        const STEP_IN_SECONDS = 5;  // DO NOT CHANGE THIS VALUE
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
                dateToUnixTimestampBN(choices_registration_start), 
                dateToUnixTimestampBN(choices_registration_end),
                dateToUnixTimestampBN(voters_registration_start),
                dateToUnixTimestampBN(voters_registration_end),
                dateToUnixTimestampBN(voting_session_start),
                dateToUnixTimestampBN(voting_session_end),
            )
            .accounts({
                proposal: proposal.publicKey,
                admin: admin.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .signers([admin, proposal])
            .rpc();
    });

    describe('create_proposal', () => {

        it('can create a new proposal with valid parameters', async () => {
            // Fetch the proposal account data
            const proposalAccount = await program.account.proposal.fetch(proposal.publicKey);

            // Verify the proposal data
            expect(proposalAccount.title).to.eql(stringToU8Array16(proposalTitle));
            expect(proposalAccount.description).to.eql(stringToU8Array32(proposalDesc));            
            expect(proposalAccount.choices).to.eql([]);
            
            expect(proposalAccount.choicesRegistrationInterval.start.eq(dateToUnixTimestampBN(choices_registration_start))).to.be.true;
            expect(proposalAccount.choicesRegistrationInterval.end.eq(dateToUnixTimestampBN(choices_registration_end))).to.be.true;
            expect(proposalAccount.votersRegistrationInterval.start.eq(dateToUnixTimestampBN(voters_registration_start))).to.be.true;
            expect(proposalAccount.votersRegistrationInterval.end.eq(dateToUnixTimestampBN(voters_registration_end))).to.be.true;
            expect(proposalAccount.votingSessionInterval.start.eq(dateToUnixTimestampBN(voting_session_start))).to.be.true;
            expect(proposalAccount.votingSessionInterval.end.eq(dateToUnixTimestampBN(voting_session_end))).to.be.true
    
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
                    dateToUnixTimestampBN(new Date("2023-07-17 14:00:00")), 
                    dateToUnixTimestampBN(new Date("2023-07-16 15:00:00")), 
                    dateToUnixTimestampBN(new Date("2023-07-18 16:00:00")), 
                    dateToUnixTimestampBN(new Date("2023-07-17 17:00:00")), 
                    dateToUnixTimestampBN(new Date("2023-07-19 18:00:00")), 
                    dateToUnixTimestampBN(new Date("2023-07-18 19:00:00")), 
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

        it(`fails to create two proposals with the same pubkey`, async () => {
            proposal = Keypair.generate();
            proposalTitle = stringToU8Array16("title test");
            proposalDesc = stringToU8Array32("desc test");

            try {
                await program.methods
                .createProposal(
                    proposalTitle, 
                    proposalDesc, 
                    dateToUnixTimestampBN(new Date("2024-07-23 14:00:00")), 
                    dateToUnixTimestampBN(new Date("2024-07-23 15:00:00")), 
                    dateToUnixTimestampBN(new Date("2024-07-23 16:00:00")), 
                    dateToUnixTimestampBN(new Date("2024-07-23 17:00:00")), 
                    dateToUnixTimestampBN(new Date("2024-07-23 18:00:00")), 
                    dateToUnixTimestampBN(new Date("2024-07-23 19:00:00")), 
                )
                .accounts({
                    proposal: proposal.publicKey,
                    admin: admin.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([admin, proposal])
                .rpc();

                await program.methods
                .createProposal(
                    proposalTitle, 
                    proposalDesc, 
                    dateToUnixTimestampBN(new Date("2024-07-24 14:00:00")), 
                    dateToUnixTimestampBN(new Date("2024-07-24 15:00:00")), 
                    dateToUnixTimestampBN(new Date("2024-07-24 16:00:00")), 
                    dateToUnixTimestampBN(new Date("2024-07-24 17:00:00")), 
                    dateToUnixTimestampBN(new Date("2024-07-24 18:00:00")), 
                    dateToUnixTimestampBN(new Date("2024-07-24 19:00:00")), 
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
                expect((error as Error).message).to.include("Simulation failed");
            }   
        });
    });

    describe('add_choice_for_one_proposal', () => {

        it('it will add a choice to an existing proposal', async () => {

            await waitUntil(choices_registration_start);

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

            const proposalAccount = await program.account.proposal.fetch(proposal.publicKey);           
            expect(proposalAccount.choices[0].count).to.eql(0);
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
                    admin: admin.publicKey,
                })
                .signers([voter0])
                .rpc();
            }
            catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("unknown signer");
            }
        })

        it("can't add the same choice twice", async () => {
            await waitUntil(choices_registration_start);
            await new Promise((resolve) => setTimeout(resolve, 2000));

            try {
                for (let i = 0; i < 2; i++) {
                    const choice = stringToU8Array16(`choice`);
                    let txChoice = await program.methods
                        .addChoiceForOneProposal(choice)
                        .accounts({
                            proposal: proposal.publicKey,
                            admin: admin.publicKey,
                        })
                        .signers([admin])
                        .rpc();

                    await connection.confirmTransaction(txChoice);
                }
            } catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("Choice already exists");
            }
        });

        it("can't add more than 10 choices to a proposal", async () => {
            await waitUntil(choices_registration_start);

            try {
                for (let i = 0; i < 11; i++) {
                    const choice = stringToU8Array16(i.toString());
                    let txChoice = await program.methods
                        .addChoiceForOneProposal(choice)
                        .accounts({
                            proposal: proposal.publicKey,
                            admin: admin.publicKey,
                        })
                        .signers([admin])
                        .rpc();

                    await connection.confirmTransaction(txChoice);
                }
            } catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("Too many choices for this proposal");
            }
        });

        it("can add up to 10 choices to a proposal", async () => {
            await waitUntil(choices_registration_start);

            try {
                for (let i = 0; i < 10; i++) {
                    const choice = stringToU8Array16(i.toString());
                    let txChoice = await program.methods
                        .addChoiceForOneProposal(choice)
                        .accounts({
                            proposal: proposal.publicKey,
                            admin: admin.publicKey,
                        })
                        .signers([admin])
                        .rpc();

                    await connection.confirmTransaction(txChoice);
                }
            } catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("Too many choices for this proposal");
            }
        });
    });

    describe('register_voter', () => {
        it('can register a voter during registration period', async () => {

            await waitUntil(voters_registration_start);

            const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                program.programId
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

        it('fails to register a voter outside of registration period', async () => {
            try {
                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    program.programId
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
                expect((error as Error).message).to.include("Voters registration is closed");
            }
        });

        it('fails to register a voter for a non existing proposal', async () => {
            try {
                await waitUntil(voters_registration_start);
                proposal = Keypair.generate();
                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    program.programId
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
                expect((error as Error).message).to.include("The program expected this account to be already initialized");
            }
        });

        it('fails to register a voter twice on the same proposal', async () => {

            try {
                await waitUntil(voters_registration_start);

                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    program.programId
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

                let txRegisterVoter1 = await program.methods
                    .registerVoter(voter0.publicKey)
                    .accounts({
                        proposal: proposal.publicKey,
                        ballot: ballot0AccountAddr,
                        admin: admin.publicKey,
                        systemProgram: anchor.web3.SystemProgram.programId,
                    })
                    .signers([admin])
                    .rpc();
                
                await connection.confirmTransaction(txRegisterVoter1);

            } catch (error) {
                expect((error as Error).message).to.include("Simulation failed");
            }

        });

        it('only allows admin to register a voter', async () => {
           try {
                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    program.programId
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

            } catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("unknown signer");
            }
        });
    });

    describe('cast_vote', () => {
       
        it('can cast a valid vote', async () => {

            await waitUntil(choices_registration_start);
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

            await waitUntil(voters_registration_start);
            const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                program.programId
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

            await waitUntil(voting_session_start);
            let txCastVote0 = await program.methods
                .castVote(0)
                .accounts({
                    proposal: proposal.publicKey,
                    ballot: ballot0AccountAddr,
                    voter: voter0.publicKey,
                })
                .signers([voter0])
                .rpc();
                
            await connection.confirmTransaction(txCastVote0);

            const proposalAccount = await program.account.proposal.fetch(proposal.publicKey);    
            expect(proposalAccount.choices[0].count).to.eql(1);
        });

        it('fails to cast a vote outside of voting period', async () => {

            try {
                await waitUntil(choices_registration_start);
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

                await waitUntil(voters_registration_start);
                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    program.programId
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

                let txCastVote0 = await program.methods
                    .castVote(0)
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
                expect((error as Error).message).to.include("Voting session is closed");
            }
        });

        it('fails to cast a vote for an invalid choice', async () => {
            try {
                await waitUntil(choices_registration_start);
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

                await waitUntil(voters_registration_start);
                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    program.programId
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

                await waitUntil(voting_session_start);
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
                expect((error as Error).message).to.include("Invalid choice index");
            }
        });

        it("same voter can't vote twice", async () => {

            try {
                await waitUntil(choices_registration_start);
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

                await waitUntil(voters_registration_start);
                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    program.programId
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

                await waitUntil(voting_session_start);
                let txCastVote0 = await program.methods
                    .castVote(0)
                    .accounts({
                        proposal: proposal.publicKey,
                        ballot: ballot0AccountAddr,
                        voter: voter0.publicKey,
                    })
                    .signers([voter0])
                    .rpc();
                    
                await connection.confirmTransaction(txCastVote0);

                let txCastVote1 = await program.methods
                    .castVote(0)
                    .accounts({
                        proposal: proposal.publicKey,
                        ballot: ballot0AccountAddr,
                        voter: voter0.publicKey,
                    })
                    .signers([voter0])
                    .rpc();
                    
                await connection.confirmTransaction(txCastVote1);

            } catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("Already voted");
            }
        });

        it('should fail if the voter is not registered', async () => {

            try {
                await waitUntil(choices_registration_start);
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

                await waitUntil(voters_registration_start);
                const [ballot0AccountAddr, bump0] = await PublicKey.findProgramAddress(
                    [proposal.publicKey.toBuffer(), voter0.publicKey.toBuffer()],
                    program.programId
                );

                await waitUntil(voting_session_start);
                let txCastVote0 = await program.methods
                    .castVote(0)
                    .accounts({
                        proposal: proposal.publicKey,
                        ballot: ballot0AccountAddr,
                        voter: voter0.publicKey,
                    })
                    .signers([voter0])
                    .rpc();
                    
                await connection.confirmTransaction(txCastVote0);

                let txCastVote1 = await program.methods
                    .castVote(0)
                    .accounts({
                        proposal: proposal.publicKey,
                        ballot: ballot0AccountAddr,
                        voter: voter0.publicKey,
                    })
                    .signers([voter0])
                    .rpc();
                    
                await connection.confirmTransaction(txCastVote1);

            } catch (error) {
                expect(error).to.be.an('error');
                expect((error as Error).message).to.include("The program expected this account to be already initialized");
            }

        });

    });
});
