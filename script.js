function showScenario(scenario) {
    // Update active button
    document.querySelectorAll('.scenario-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Update demo content based on scenario
    const pbacPolicy = document.getElementById('pbac-policy');
    const rebacPolicy = document.getElementById('rebac-policy');
    const pbacAccess = document.getElementById('pbac-access');
    const rebacAccess = document.getElementById('rebac-access');

    switch(scenario) {
        case 'enterprise':
            pbacPolicy.innerHTML = `Allow employees to access company resources
IF user.department = resource.department
AND user.clearanceLevel >= resource.sensitivity
AND location.isOfficeNetwork = true
AND timeOfDay.isBusinessHours = true
AND user.trainingCompleted.includes(resource.requiredTraining)`;
            rebacPolicy.innerHTML = `Allow access to resource
IF user --[employed_by]--> company --[owns]--> resource
OR user --[member_of]--> department --[manages]--> resource
OR user --[assigned_to]--> project --[uses]--> resource
OR user --[reports_to]--> manager --[has_access]--> resource`;
            break;

        case 'healthcare':
            pbacPolicy.innerHTML = `Allow medical professionals to access patient records
IF user.role IN ["Doctor", "Nurse", "Specialist"]
AND user.license.isValid = true
AND patient.consentGiven = true
AND (location.isHospital = true OR user.remoteAccessApproved = true)
AND timeOfAccess.isEmergency = true 
   OR timeOfAccess.isBusinessHours = true`;
            rebacPolicy.innerHTML = `Allow access to patient record
IF user --[primary_physician]--> patient
OR user --[attending_physician]--> patient
OR user --[assigned_nurse]--> patient --[has_record]--> record
OR user --[specialist_referral]--> patient
OR user --[emergency_access_granted]--> record`;
            break;

        case 'collaboration':
            pbacPolicy.innerHTML = `Allow team members to access project resources
IF user.status = "Active"
AND project.status != "Archived"
AND (user.role = "ProjectOwner" 
    OR (user.role = "Contributor" AND resource.type != "Confidential")
    OR (user.role = "Viewer" AND action = "read"))
AND user.nda.signed = true`;
            rebacPolicy.innerHTML = `Allow access to project resource
IF user --[owns]--> project --[contains]--> resource
OR user --[member]--> team --[assigned_to]--> project
OR user --[invited_to]--> project WITH permission = action
OR user --[manages]--> team --[works_on]--> project
OR resource --[shared_with]--> user`;
            break;

        case 'finance':
            pbacPolicy.innerHTML = `Allow financial transactions
IF user.accountStatus = "Active"
AND user.verificationLevel >= transaction.requiredLevel
AND transaction.amount <= user.dailyLimit
AND location.country IN user.allowedCountries
AND NOT location.isHighRisk = true
AND (transaction.type = "Withdrawal" 
    IMPLIES account.balance >= transaction.amount)`;
            rebacPolicy.innerHTML = `Allow transaction on account
IF user --[owns]--> account
OR user --[authorized_user]--> account
OR user --[power_of_attorney]--> account.owner
OR (user --[employee]--> bank 
    AND user --[manages_accounts]--> account)
OR user --[joint_owner]--> account`;
            pbacAccess.innerHTML = '✓ Access Granted - Risk assessment passed';
            rebacAccess.innerHTML = '✓ Access Granted - Authorized relationship';
            break;
    }

    // Animate the change
    [pbacPolicy, rebacPolicy].forEach(el => {
        el.style.opacity = '0';
        setTimeout(() => {
            el.style.opacity = '1';
        }, 200);
    });
}

// Add interactive animations for model cards
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.model-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const beforeElement = card.querySelector('::before');
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Add smooth scroll for navigation (if any anchor links are added in the future)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
