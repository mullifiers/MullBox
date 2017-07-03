from guessit import guessit
import sys, json

#Read data from stdin
def read_in():
    lines = sys.stdin.readlines()
    #Since our input would only be having one line, parse our JSON data from that
    return json.loads(lines[0])
def extractguess(data):
    datafinal=dict(guessit(data))
    datafinal.pop('language',None)
    datafinalJSON=json.dumps(datafinal)
    return datafinal

def main():
    
    # get our data as an array from read_in()
    portf=open('C:\hiiiiiiiiiiiiiiiiiiiii.txt','w+')
    portf.truncate()
    # finalList=(dict(guessit('Pyaar Ka Punchnama 2011 Hindi 720p BRRip CharmeLeon Silver RG.mkv')))
    # finalList.pop('language')
    # finalListJSON=json.dumps(finalList)
    # print(finalListJSON)
    portf.write(finalListJSON)
    portf.write(finalListJSON)
    guessedit=list()
    
    lines = read_in()
    for i in lines:
        guessedit.append((extractguess(i['name'])))

    portf.write(json.dumps(guessedit))
    print((json.dumps(guessedit)))
     
    # sys.stdout.write(json.dumps(json.dumps(guessedit)))
    sys.stdout.flush()
    portf.flush()

#start process
if __name__ == '__main__':
    main()