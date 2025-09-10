function constructAlarmAddressSpace(server, addressSpace, eventObjects, done) {
    // server = the created node-opcua server
    // addressSpace = script placeholder
    // eventObjects = to hold event variables in memory from this script

    // internal global sandbox objects are 
    // node = node of the flex server, 
    // coreServer = core iiot server object for debug and access to nodeOPCUA,
    // and scriptObjects to hold variables and functions
    const LocalizedText = opcua.LocalizedText
    const namespace = addressSpace.getOwnNamespace()
    const VT = opcua.VariantArrayType

    coreServer.internalDebugLog('init dynamic address space')
    node.warn('construct new address space for OPC UA')

    // from here - see the node-opcua docs how to build address spaces
    let tanks = namespace.addObject({
        browseName: 'Tanks',
        description: 'The Object representing some tanks',
        organizedBy: addressSpace.rootFolder.objects,
        notifierOf: addressSpace.rootFolder.objects.server
    })

    let oilTankLevel = namespace.addVariable({
        browseName: 'OilTankLevel',
        displayName: [
            new LocalizedText({ text: 'Oil Tank Level', locale: 'en-US' }),
            new LocalizedText({ text: 'Öl Tank Füllstand', locale: 'de-DE' })
        ],
        description: 'Fill level in percentage (0% to 100%) of the oil tank',
        propertyOf: tanks,
        dataType: 'Double',
        eventSourceOf: tanks
    })

    // ---------------------------------------------------------------------------------
    // Let's create a exclusive Limit Alarm that automatically raise itself
    // when the tank level is out of limit
    // ---------------------------------------------------------------------------------
    let exclusiveLimitAlarmType = addressSpace.findEventType('ExclusiveLimitAlarmType')

    let oilTankLevelCondition = namespace.instantiateExclusiveLimitAlarm(exclusiveLimitAlarmType, {
        componentOf: tanks,
        conditionSource: oilTankLevel,
        browseName: 'OilTankLevelCondition',
        displayName: [
            new LocalizedText({ text: 'Oil Tank Level Condition', locale: 'en-US' }),
            new LocalizedText({ text: 'Öl Tank Füllstand Bedingung', locale: 'de-DE' })
        ],
        description: 'ExclusiveLimitAlarmType Condition',
        conditionName: 'OilLevelCondition',
        optionals: [
            'ConfirmedState', 'Confirm' // confirm state and confirm Method
        ],
        inputNode: oilTankLevel,   // the variable that will be monitored for change
        highHighLimit: 0.9,
        highLimit: 0.8,
        lowLimit: 0.2
    })

    // --------------------------------------------------------------
    // Let's create a second variable with no Exclusive alarm
    // --------------------------------------------------------------
    let gasTankLevel = namespace.addVariable({
        browseName: 'GasTankLevel',
        displayName: [
            new LocalizedText({ text: 'Gas Tank Level', locale: 'en-US' }),
            new LocalizedText({ text: 'Gas Tank Füllstand', locale: 'de-DE' })
        ],
        description: 'Fill level in percentage (0% to 100%) of the gas tank',
        propertyOf: tanks,
        dataType: 'Double',
        eventSourceOf: tanks
    })

    // byte variable with value
    if (scriptObjects.oilTankNumber === undefined || scriptObjects.oilTankNumber === null) {
        scriptObjects.oilTankNumber = 100
    }

    let oilTankNumber = namespace.addVariable({
        nodeId: "s=OilTankNumber",
        browseName: 'OilTankNumber',
        displayName: [
            new LocalizedText({ text: 'Oil Tank Number', locale: 'en-US' }),
            new LocalizedText({ text: 'Öl Tank Nummer', locale: 'de-DE' })
        ],
        description: 'Number of the oil tank',
        propertyOf: tanks,
        dataType: 'Byte',
        value: {
            get: function () {
                return new opcua.Variant({
                    dataType: 'Byte',
                    value: scriptObjects.oilTankNumber
                })
            },
            set: function (variant) {
                scriptObjects.oilTankNumber = variant.value
                return opcua.StatusCodes.Good
            }
        }
    })

    let nonExclusiveLimitAlarmType = addressSpace.findEventType('NonExclusiveLimitAlarmType')

    let gasTankLevelCondition = namespace.instantiateNonExclusiveLimitAlarm(nonExclusiveLimitAlarmType, {
        componentOf: tanks,
        conditionSource: gasTankLevel,
        browseName: 'GasTankLevelCondition',
        displayName: [
            new LocalizedText({ text: 'Gas Tank Level Condition', locale: 'en-US' }),
            new LocalizedText({ text: 'Gas Tank Füllstand Bedingung', locale: 'de-DE' })
        ],
        description: 'NonExclusiveLimitAlarmType Condition',
        conditionName: 'GasLevelCondition',
        optionals: [
            'ConfirmedState', 'Confirm' // confirm state and confirm Method
        ],
        inputNode: gasTankLevel,   // the variable that will be monitored for change
        highHighLimit: 0.9,
        highLimit: 0.8,
        lowLimit: 0.2
    })

    // variable with value
    if (scriptObjects.testReadWrite === undefined || scriptObjects.testReadWrite === null) {
        scriptObjects.testReadWrite = 1000.0
    }

    let myVariables = namespace.addObject({
        browseName: 'MyVariables',
        description: 'The Object representing some variables',
        organizedBy: addressSpace.rootFolder.objects,
        notifierOf: addressSpace.rootFolder.objects.server
    })

    if (coreServer.core) {
        namespace.addVariable({
            componentOf: myVariables,
            nodeId: 'ns=1;s=TestReadWrite',
            browseName: 'TestReadWrite',
            displayName: [
                new LocalizedText({ text: 'Test Read and Write', locale: 'en-US' }),
                new LocalizedText({ text: 'Test Lesen Schreiben', locale: 'de-DE' })
            ],
            dataType: 'Double',
            value: {
                get: function () {
                    return new opcua.Variant({
                        dataType: 'Double',
                        value: scriptObjects.testReadWrite
                    })
                },
                set: function (variant) {
                    scriptObjects.testReadWrite = parseFloat(variant.value)
                    return opcua.StatusCodes.Good
                }
            }
        })

        let memoryVariable = namespace.addVariable({
            componentOf: myVariables,
            nodeId: 'ns=1;s=free_memory',
            browseName: 'FreeMemory',
            displayName: [
                new LocalizedText({ text: 'Free Memory', locale: 'en-US' }),
                new LocalizedText({ text: 'ungenutzer RAM', locale: 'de-DE' })
            ],
            dataType: 'Double',
            value: {
                get: function () {
                    return new opcua.Variant({
                        dataType: 'Double',
                        value: coreServer.core.availableMemory()
                    })
                }
            }
        })
        addressSpace.installHistoricalDataNode(memoryVariable)
    }

    // -----------------------------
    // 11 ARRAY VARIABLES R/W (10)
    // -----------------------------
    function addArrayVar(opts) {
        // opts: { key, nodeId, browseName, dataType, init, coerce }
        if (scriptObjects[opts.key] === undefined || scriptObjects[opts.key] === null) {
            scriptObjects[opts.key] = opts.init()
        }
        const getter = function () {
            return new opcua.Variant({
                dataType: opts.dataType,
                arrayType: VT.Array,
                value: scriptObjects[opts.key]
            })
        }
        const setter = function (variant) {
            let v = variant && variant.value != null ? variant.value : []
            if (!Array.isArray(v)) v = [v]    // tolleranza: se arriva uno scalare
            if (typeof opts.coerce === 'function') {
                v = v.map(opts.coerce)
            }
            scriptObjects[opts.key] = v
            return opcua.StatusCodes.Good
        }
        namespace.addVariable({
            componentOf: myVariables,
            nodeId: 'ns=1;s=' + opts.nodeId,
            browseName: opts.browseName,
            displayName: [new LocalizedText({ text: opts.browseName, locale: 'en-US' })],
            dataType: opts.dataType,
            value: { get: getter, set: setter }
        })
    }

    const seq = (n, fn) => Array.from({ length: n }, (_, i) => fn(i))

    // Numeric 16/32/float/double
    addArrayVar({
        key: 'ARR_UInt16',
        nodeId: 'ARR:UInt16',
        browseName: 'UInt16_Array_10',
        dataType: 'UInt16',
        init: () => seq(10, i => i),
        coerce: x => Number(x)
    })
    addArrayVar({
        key: 'ARR_UInt32',
        nodeId: 'ARR:UInt32',
        browseName: 'UInt32_Array_10',
        dataType: 'UInt32',
        init: () => seq(10, i => i * 2),
        coerce: x => Number(x)
    })
    addArrayVar({
        key: 'ARR_Int16',
        nodeId: 'ARR:Int16',
        browseName: 'Int16_Array_10',
        dataType: 'Int16',
        init: () => seq(10, i => i - 5),
        coerce: x => Number(x)
    })
    addArrayVar({
        key: 'ARR_Int32',
        nodeId: 'ARR:Int32',
        browseName: 'Int32_Array_10',
        dataType: 'Int32',
        init: () => seq(10, i => i * 10),
        coerce: x => Number(x)
    })
    addArrayVar({
        key: 'ARR_Float',
        nodeId: 'ARR:Float',
        browseName: 'Float_Array_10',
        dataType: 'Float',
        init: () => seq(10, i => i + 0.5),
        coerce: x => Number(x)
    })
    addArrayVar({
        key: 'ARR_Double',
        nodeId: 'ARR:Double',
        browseName: 'Double_Array_10',
        dataType: 'Double',
        init: () => seq(10, i => i * 1.25),
        coerce: x => Number(x)
    })

    // 64-bit come oggetti node-opcua (coerce da stringhe/number)
    addArrayVar({
        key: 'ARR_UInt64',
        nodeId: 'ARR:UInt64',
        browseName: 'UInt64_Array_10',
        dataType: 'UInt64',
        init: () => seq(10, i => opcua.coerceUInt64(String(i))),
        coerce: x => opcua.coerceUInt64(String(x))
    })
    addArrayVar({
        key: 'ARR_Int64',
        nodeId: 'ARR:Int64',
        browseName: 'Int64_Array_10',
        dataType: 'Int64',
        init: () => seq(10, i => opcua.coerceInt64(String(i - 3))),
        coerce: x => opcua.coerceInt64(String(x))
    })

    // Boolean, String, Byte
    addArrayVar({
        key: 'ARR_Boolean',
        nodeId: 'ARR:Boolean',
        browseName: 'Boolean_Array_10',
        dataType: 'Boolean',
        init: () => seq(10, i => (i % 2 === 0)),
        coerce: x => (x === true || x === 'true' || x === 1 || x === '1')
    })
    addArrayVar({
        key: 'ARR_String',
        nodeId: 'ARR:String',
        browseName: 'String_Array_10',
        dataType: 'String',
        init: () => seq(10, i => 'S' + i),
        coerce: x => String(x)
    })
    addArrayVar({
        key: 'ARR_Byte',
        nodeId: 'ARR:Byte',
        browseName: 'Byte_Array_10',
        dataType: 'Byte',
        init: () => seq(10, i => (i % 256)),
        coerce: x => (Number(x) & 255)
    })

    // hold event objects in memory 
    eventObjects.oilTankLevel = oilTankLevel
    eventObjects.oilTankLevelCondition = oilTankLevelCondition
    eventObjects.gasTankLevel = gasTankLevel
    eventObjects.gasTankLevelCondition = gasTankLevelCondition

    done()
}
