// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


abstract contract ReentrancyGuard {
    uint256 private _status;

    constructor() {
        _status = 1;
    }

    modifier nonReentrant() {
        require(_status == 1, "ReentrancyGuard: reentrant call");
        _status = 2;
        _;
        _status = 1;
    }
}


contract MaungBizCommunityFund is ReentrancyGuard {

    // =========================
    // CONSTANTS
    // =========================

    uint256 public constant MIN_REQUEST = 0.01 ether;
    uint256 public constant VOTING_DURATION = 3 days;

    // =========================
    // STATUS ENUM
    // =========================

    enum Status {
        Active,
        Approved,
        Rejected,
        Released
    }

    // =========================
    // PROPOSAL STRUCT
    // =========================

    struct Proposal {
        uint256 id;
        address proposer;
        string name;
        string category;
        string description;
        uint256 requestedAmount;
        uint256 jobs;
        uint256 yesVotes;
        uint256 noVotes;
        uint256 deadline;
        Status status;
        bool fundsReleased;
    }

    // =========================
    // STORAGE
    // =========================

    uint256 public proposalCount;

    mapping(uint256 => Proposal) public proposals;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    // =========================
    // EVENTS
    // =========================

    event ProposalCreated(
        uint256 indexed id,
        address indexed proposer,
        uint256 requestedAmount
    );

    event Voted(
        uint256 indexed id,
        address indexed voter,
        bool support
    );

    event ProposalApproved(uint256 indexed id);
    event ProposalRejected(uint256 indexed id);
    event FundsReleased(uint256 indexed id, uint256 amount);

    // =========================
    // MODIFIER
    // =========================

    modifier proposalExists(uint256 _id) {
        require(_id > 0 && _id <= proposalCount, "Invalid proposal");
        _;
    }

    // =========================
    // CREATE FUNDING PROPOSAL
    // =========================

    function createFundingProposal(
        string memory _name,
        string memory _category,
        string memory _description,
        uint256 _requestedAmount,
        uint256 _jobs
    ) external {

        require(_requestedAmount >= MIN_REQUEST, "Below minimum request");

        proposalCount++;

        proposals[proposalCount] = Proposal({
            id: proposalCount,
            proposer: msg.sender,
            name: _name,
            category: _category,
            description: _description,
            requestedAmount: _requestedAmount,
            jobs: _jobs,
            yesVotes: 0,
            noVotes: 0,
            deadline: block.timestamp + VOTING_DURATION,
            status: Status.Active,
            fundsReleased: false
        });

        emit ProposalCreated(proposalCount, msg.sender, _requestedAmount);
    }

    // =========================
    // VOTE
    // =========================

    function vote(uint256 _id, bool _support)
        external
        proposalExists(_id)
    {
        Proposal storage proposal = proposals[_id];

        require(block.timestamp < proposal.deadline, "Voting ended");
        require(!hasVoted[_id][msg.sender], "Already voted");
        require(proposal.status == Status.Active, "Not active");

        hasVoted[_id][msg.sender] = true;

        if (_support) {
            proposal.yesVotes++;
        } else {
            proposal.noVotes++;
        }

        emit Voted(_id, msg.sender, _support);
    }

    // =========================
    // FINALIZE PROPOSAL
    // =========================

    function finalizeProposal(uint256 _id)
        public
        proposalExists(_id)
    {
        Proposal storage proposal = proposals[_id];

        require(block.timestamp >= proposal.deadline, "Voting ongoing");
        require(proposal.status == Status.Active, "Already finalized");

        if (proposal.yesVotes > proposal.noVotes) {
            proposal.status = Status.Approved;
            emit ProposalApproved(_id);
        } else {
            proposal.status = Status.Rejected;
            emit ProposalRejected(_id);
        }
    }

    // =========================
    // RELEASE FUNDS
    // =========================

    function releaseFunds(uint256 _id)
        external
        proposalExists(_id)
        nonReentrant
    {
        Proposal storage proposal = proposals[_id];

        require(proposal.status == Status.Approved, "Not approved");
        require(!proposal.fundsReleased, "Already released");
        require(
            address(this).balance >= proposal.requestedAmount,
            "Insufficient treasury"
        );

        proposal.fundsReleased = true;
        proposal.status = Status.Released;

        (bool success, ) = payable(proposal.proposer).call{
            value: proposal.requestedAmount
        }("");

        require(success, "Transfer failed");

        emit FundsReleased(_id, proposal.requestedAmount);
    }

    // =========================
    // TREASURY
    // =========================

    receive() external payable {}

    function getTreasuryBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // =========================
    // VIEW HELPERS
    // =========================

    function getProposal(uint256 _id)
        external
        view
        proposalExists(_id)
        returns (Proposal memory)
    {
        return proposals[_id];
    }
}
